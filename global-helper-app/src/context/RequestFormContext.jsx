import React, { createContext, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// --- FIX: Corrected Imports ---
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
// --- END FIX ---

// Define the initial state structure
const initialFormState = {
    // Basic request details
    title: "",
    isOnline: false,
    location: "",
    latitude: null,
    longitude: null, // Add geocoding later if needed
    date: "",
    time: "",
    description: "",
    media: null, // Store FileList object here initially
    mediaURLs: [], // Store uploaded URLs here

    // Task status and timeline
    status: 'pending', // Default status
    createdAt: null,   // Will be set on submit
    userId: null,      // Will be set from props/auth state
    createdByDisplayName: "", // Optional, can be populated after login

    // Compassion-related fields
    compassionLevel: 3, // The urgency or compassion level of the task (1–5)
    urgencyLevel: 5,    // Urgency of the task (1–5, with 5 being the highest)

    // Volunteer offers and assignment
    volunteerOffers: [], // Array of offers made by volunteers
    assignedVolunteerId: null, // Volunteer ID assigned to the task

    // Language and skills requirements
    languagesNeeded: [], // Languages required for the task (array)
    volunteerSkills: [], // Skills needed to perform the task (array)

    // Location-related details
    locationDetails: "", // Additional location details (optional)

    // Categories and tags for sorting/filtering
    categories: [], // Categories for the task (array)

    // Time zone context for scheduling
    timeZone: "UTC+3", // Default time zone
};

// Define steps and their corresponding routes
export const requestSteps = [
    { id: 'title', path: '/request/title', validation: (form) => !!form.title?.trim() },
    { id: 'online', path: '/request/online' },
    { id: 'location', path: '/request/location', validation: (form) => form.isOnline || !!form.location?.trim() },
    { id: 'date', path: '/request/date', validation: (form) => !!form.date },
    { id: 'description', path: '/request/description', validation: (form) => !!form.description?.trim() },
    { id: 'urgency', label: 'Compassion Level', path: '/request/compassion' },
    { id: 'media', path: '/request/media' },
    { id: 'review', path: '/request/review' }
];

// Create Context
const RequestFormContext = createContext(null);

// Create Provider Component
export const RequestFormProvider = ({ children, user }) => {
    const [form, setForm] = useState(initialFormState);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [warning, setWarning] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // General update function
    const updateForm = useCallback((name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
        setWarning(null); // Clear warning on input change
    }, []);

    // Function to handle file selection/changes
    const handleMediaChange = useCallback((files) => { // Accepts FileList or null
        setForm(prev => ({ ...prev, media: files }));
        setWarning(null);
    }, []);

    // Navigation functions
    const getCurrentStep = () => requestSteps[currentStepIndex];

    const isStepValid = useCallback(() => {
        const stepConfig = getCurrentStep();
        if (stepConfig?.id === 'review') {
            return true;
        }
        if (stepConfig?.validation) {
            return stepConfig.validation(form);
        }
        return true;
    }, [currentStepIndex, form]);

    const goToNextStep = useCallback(() => {
        if (!isStepValid()) {
            setWarning("Please complete the required information for this step.");
            return;
        }
        setWarning(null);
        if (currentStepIndex < requestSteps.length - 1) {
            const nextStepIndex = currentStepIndex + 1;
            setCurrentStepIndex(nextStepIndex);
            navigate(requestSteps[nextStepIndex].path);
        } else {
            // On the last step (review), StepNavigation calls submitRequest directly
            console.log("Attempting to submit from last step (via goToNextStep - should be handled by button)");
        }
    }, [currentStepIndex, navigate, isStepValid, requestSteps.length]);

    const goToPrevStep = useCallback(() => {
        setWarning(null);
        if (currentStepIndex > 0) {
            const prevStepIndex = currentStepIndex - 1;
            setCurrentStepIndex(prevStepIndex);
            navigate(requestSteps[prevStepIndex].path);
        }
    }, [currentStepIndex, navigate]);

    const goToStep = useCallback((stepId) => {
        const stepIndex = requestSteps.findIndex(s => s.id === stepId);
        if (stepIndex !== -1 && stepIndex <= currentStepIndex) {
            setCurrentStepIndex(stepIndex);
            navigate(requestSteps[stepIndex].path);
            setWarning(null);
        } else if (stepIndex > currentStepIndex) {
            console.warn("Cannot jump forward to uncompleted steps via progress bar/edit links.");
        }
    }, [currentStepIndex, navigate]);

    // Reset function
    const resetForm = useCallback(() => {
        setForm(initialFormState);
        setCurrentStepIndex(0);
        setWarning(null);
        setIsSubmitting(false);
    }, [navigate]);

    // Submission logic - triggered from StepNavigation on the 'review' step
    const submitRequest = useCallback(async () => {
        if (!user?.uid) {
            console.error("User ID is missing. Cannot submit request.");
            setWarning("Authentication error. Please log in again.");
            setIsSubmitting(false);
            return;
        }

        if (!form.title || !form.date || !form.description || (!form.isOnline && !form.location)) {
            console.error("Attempting submit, but required fields are missing.", form);
            setWarning("It seems some required information is missing. Please go back and check.");
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setWarning(null);
        console.log("Submitting request...");

        try {
            // 1. Upload media if present
            let uploadedMediaURLs = [];
            if (form.media && form.media.length > 0) {
                const storage = getStorage(); // Get storage instance
                const filesToUpload = Array.from(form.media);

                uploadedMediaURLs = await Promise.all(
                    filesToUpload.map(async (file) => {
                        const uniqueFileName = `${Date.now()}_${file.name}`;
                        const path = `requests/${user.uid}/${uniqueFileName}`;
                        const fileRef = storageRef(storage, path); // Use storageRef correctly
                        console.log(`Uploading ${file.name} to ${path}`);
                        const snap = await uploadBytes(fileRef, file);
                        const url = await getDownloadURL(snap.ref);
                        console.log(`Uploaded ${file.name}, URL: ${url}`);
                        return url;
                    })
                );
            }

            // 2. Prepare Firestore data
            const requestData = {
                title: form.title,
                isOnline: form.isOnline,
                location: form.isOnline ? "" : form.location,
                date: form.date,
                time: form.time || "",
                description: form.description,
                mediaURLs: uploadedMediaURLs,
                status: 'pending',
                createdAt: Timestamp.now(), // Use Firestore Timestamp
                userId: user.uid,
                compassionLevel: form.compassionLevel, // New field
                urgencyLevel: form.urgencyLevel, // New field
                volunteerOffers: form.volunteerOffers, // New field
                assignedVolunteerId: form.assignedVolunteerId, // New field
                languagesNeeded: form.languagesNeeded, // New field
                volunteerSkills: form.volunteerSkills, // New field
                locationDetails: form.locationDetails, // New field
                categories: form.categories, // New field
                timeZone: form.timeZone, // New field
            };

            console.log("Submitting request data to Firestore:", requestData);

            // 3. Add to Firestore
            const docRef = await addDoc(collection(db, "requests"), requestData);
            console.log("Document written with ID: ", docRef.id);

            // 4. Reset state and navigate on success
            resetForm();
            navigate("/successful-submission");

        } catch (error) {
            console.error("Error submitting request:", error);
            setWarning(`Submission failed: ${error.message || "Please try again."}`);
            setIsSubmitting(false);
        }
    }, [form, user, navigate, resetForm]);

    // Value provided to consumers
    const value = {
        form,
        updateForm,
        handleMediaChange,
        warning,
        setWarning,
        currentStepIndex,
        getCurrentStep,
        goToNextStep,
        goToPrevStep,
        goToStep,
        isStepValid,
        submitRequest,
        isSubmitting,
        totalSteps: requestSteps.length,
        resetForm,
    };

    return (
        <RequestFormContext.Provider value={value}>
            {children}
        </RequestFormContext.Provider>
    );
};

// Create custom hook to use context
export const useRequestForm = () => {
    const context = useContext(RequestFormContext);
    if (!context) {
        throw new Error("useRequestForm must be used within a RequestFormProvider");
    }
    return context;
};
