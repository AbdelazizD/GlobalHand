import React from 'react';
import { useRequestForm, requestSteps } from '../../context/RequestFormContext';

export default function ProgressBar() {
    const { currentStepIndex, totalSteps, goToStep } = useRequestForm();
    const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

    return (
        <div className="mb-6">
             {/* Optional: Step indicators */}
            <div className="flex justify-between text-xs text-gray-500 mb-1 px-1">
                 {requestSteps.map((step, index) => (
                    <button
                         key={step.id}
                         onClick={() => goToStep(step.id)} // Allow clicking previous steps
                         disabled={index > currentStepIndex} // Disable future steps
                         className={`capitalize ${index <= currentStepIndex ? 'text-emerald-600 font-medium cursor-pointer hover:underline' : 'text-gray-400 cursor-default'}`}
                     >
                         {step.id}
                     </button>
                 ))}
             </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
}