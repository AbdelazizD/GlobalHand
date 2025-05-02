import React from 'react';
import { useRequestForm, requestSteps } from '../../context/RequestFormContext';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

// Helper to format date for display
const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, options); // Add T00:00:00 to avoid timezone issues
    } catch (e) {
        return dateString; // Fallback
    }
};

// Helper to format time for display
const formatTime = (timeString) => {
    if (!timeString) return 'Any time';
    try {
        // Basic formatting, assumes HH:MM
        const [hours, minutes] = timeString.split(':');
        const h = parseInt(hours, 10);
        const m = minutes;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHour = h % 12 === 0 ? 12 : h % 12;
        return `${formattedHour}:${m} ${ampm}`;
    } catch (e) {
        return timeString; // Fallback
    }
};


export default function StepReview() {
    const { form, goToStep } = useRequestForm();

    // Helper component for review sections
    const ReviewSection = ({ label, value, stepId }) => (
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
            <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                 <span className="flex-grow whitespace-pre-wrap">{value || 'Not specified'}</span>
                 <button
                    onClick={() => goToStep(stepId)}
                    className="ml-4 flex-shrink-0 rounded-md bg-white px-2 py-1 text-xs font-medium text-emerald-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    aria-label={`Edit ${label}`}
                 >
                     <PencilSquareIcon className="h-4 w-4 inline mr-1" aria-hidden="true" />
                     Edit
                 </button>
            </dd>
        </div>
    );

    const getMediaNames = () => {
        if (!form.media || form.media.length === 0) return 'None';
        return Array.from(form.media).map(f => f.name).join(', ');
    };

    return (
        <div className="animate-fade-in">
            <h3 className="text-lg font-semibold leading-7 text-gray-900 border-b pb-2 mb-4">Review Your Request</h3>
            <p className="mb-4 text-sm text-gray-600">
                Please check the details below carefully before submitting. Ensure no personal identifying information is included.
            </p>
            <dl className="divide-y divide-gray-100">
                <ReviewSection label="Task Title" value={form.title} stepId="title" />
                <ReviewSection label="Online Task" value={form.isOnline ? 'Yes' : 'No'} stepId="online" />
                {!form.isOnline && (
                    <ReviewSection label="General Location" value={form.location} stepId="location" />
                )}
                <ReviewSection label="Preferred Date" value={formatDate(form.date)} stepId="date" />
                <ReviewSection label="Preferred Time" value={formatTime(form.time)} stepId="date" />
                <ReviewSection label="Description" value={form.description} stepId="description" />
                 <ReviewSection label="Media Files" value={getMediaNames()} stepId="media" />
            </dl>
            <p className="mt-6 text-sm text-red-600 font-medium">
                 🔒 Double-check that you haven't included names, exact addresses, phone numbers, or other identifying details in the title or description.
            </p>
        </div>
    );
}