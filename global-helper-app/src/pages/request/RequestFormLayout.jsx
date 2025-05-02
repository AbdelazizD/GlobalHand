// src/pages/request/RequestFormLayout.jsx
import React from 'react';
import { Outlet, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { RequestFormProvider, useRequestForm, requestSteps } from '../../context/RequestFormContext';
import StepNavigation from '../../components/request/StepNavigation';
import ProgressBar from '../../components/request/ProgressBar';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import StepCompassion from './StepCompassion';
import { AnimatePresence, motion } from 'framer-motion';  // Add this import



// Wrapper component remains the same
const RequestFormWrapper = ({ user }) => {
    return (
        <RequestFormProvider user={user}> {/* Pass user data down */}
            <RequestFormContent />
        </RequestFormProvider>
    );
};

// Content layout remains the same
const RequestFormContent = () => {
    const { warning, currentStepIndex, getCurrentStep } = useRequestForm();
    const location = useLocation();

    React.useEffect(() => {
        const currentPath = location.pathname;
        const stepIndex = requestSteps.findIndex(step => step.path === currentPath);
        // Optional: sync context index if needed
    }, [location.pathname]);

    const currentStepConfig = getCurrentStep();

    return (
<div className="mx-auto p-4 bg-white shadow-lg rounded-lg my-6 border border-gray-200">
<h2 className="text-2xl font-semibold text-emerald-600 mb-2">
                Post a Request
            </h2>
            <p className="text-sm text-gray-600 mb-4">
                Help us understand your need. ({`Step ${currentStepIndex + 1} of ${requestSteps.length}`}){' '}
                <span className="font-medium">{currentStepConfig?.id?.toUpperCase()}</span>
            </p>

            {warning && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center space-x-2 animate-shake">
                    <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                    <span>{warning}</span>
                </div>
            )}

            <ProgressBar />

            {/* Step Content with animation and dynamic height handling */}
            <div className="mt-6 mb-6 relative overflow-visible min-h-[280px] transition-all duration-300 ease-in-out">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </div>

            <StepNavigation />
        </div>
    );
};


// Define the routes for the steps, including the new review route
const RequestFormRoutes = ({ user }) => {
    // Auth check example (already present in App.js, but could be here too as defense)
    // if (!user) {
    //    console.log("RequestFormRoutes: No user found, redirecting to login.");
    //    return <Navigate to="/login" state={{ from: '/request' }} replace />;
    // }

    return (
        <Routes>
             {/* The wrapper provides the context */}
            <Route path="/" element={<RequestFormWrapper user={user} />}>
                 {/* Default redirect to the first step */}
                <Route index element={<Navigate to={requestSteps[0].path} replace />} />

                {/* Define each step route */}
                <Route path="title" element={<StepTitle />} />
                <Route path="online" element={<StepOnline />} />
                <Route path="location" element={<StepLocation />} />
                <Route path="date" element={<StepDate />} />
                <Route path="description" element={<StepDescription />} />
                <Route path="compassion" element={<StepCompassion />} />
                <Route path="media" element={<StepMedia />} />
                {/* --- Added route for the review step --- */}
                <Route path="review" element={<StepReview />} />

                 {/* Optional: Catch-all for invalid step paths within /request, redirects to first step */}
                 <Route path="*" element={<Navigate to={requestSteps[0].path} replace />} />
            </Route>
        </Routes>
    );
};

// Export the Routes component to be used in App.js
export default RequestFormRoutes;


// --- Import all necessary step components ---
import StepTitle from './StepTitle';
import StepOnline from './StepOnline';
import StepLocation from './StepLocation';
import StepDate from './StepDate';
import StepDescription from './StepDescription';
import StepMedia from './StepMedia';
// --- Added import for StepReview ---
import StepReview from './StepReview';