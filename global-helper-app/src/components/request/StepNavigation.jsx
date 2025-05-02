import React from 'react';
import { useRequestForm } from '../../context/RequestFormContext';
import { ArrowPathIcon } from '@heroicons/react/24/solid'; // For loading state

export default function StepNavigation() {
    const {
        currentStepIndex,
        totalSteps,
        goToPrevStep,
        goToNextStep,
        submitRequest,
        isStepValid,
        isSubmitting,
    } = useRequestForm();

    const isLastStep = currentStepIndex === totalSteps - 1;

    return (
        <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
            <button
                type="button"
                onClick={goToPrevStep}
                disabled={currentStepIndex === 0 || isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Back
            </button>

            {!isLastStep ? (
                <button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!isStepValid() || isSubmitting}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        !isStepValid() || isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                    }`}
                >
                    Next
                </button>
            ) : (
                <button
                    type="button"
                    onClick={submitRequest}
                    disabled={!isStepValid() || isSubmitting} // Can add more validation check here if needed
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                         !isStepValid() || isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Request'
                    )}
                </button>
            )}
        </div>
    );
}