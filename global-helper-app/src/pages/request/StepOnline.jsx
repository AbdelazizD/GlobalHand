import React from 'react';
import { useRequestForm } from '../../context/RequestFormContext';

export default function StepOnline() {
    const { form, updateForm } = useRequestForm();

    const handleChange = (e) => {
        updateForm(e.target.name, e.target.checked); // Use e.target.checked for checkboxes
    };

    return (
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
            <label className="text-sm font-medium text-gray-700">
                Can this task be completed entirely online?
            </label>
            <div className="flex items-center space-x-4">
                <span className={`text-sm ${!form.isOnline ? 'text-emerald-700 font-semibold' : 'text-gray-600'}`}>
                    No (Requires Location)
                </span>
                {/* Using a visually distinct toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        id="isOnline"
                        name="isOnline"
                        checked={form.isOnline}
                        onChange={handleChange}
                        className="sr-only peer" // Hide default checkbox
                    />
                    {/* Custom toggle track */}
                    <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-emerald-400 dark:bg-gray-600 peer-checked:bg-emerald-500 transition duration-300 ease-in-out"></div>
                    {/* Custom toggle knob */}
                    <div className="absolute left-1 top-1 bg-white border-gray-300 border w-5 h-5 rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-7 dark:border-gray-500"></div>
                </label>
                <span className={`text-sm ${form.isOnline ? 'text-emerald-700 font-semibold' : 'text-gray-600'}`}>
                    Yes (Online Only)
                </span>
            </div>
            <p className="text-xs text-gray-500 text-center">
                Select 'Yes' if no physical presence is needed from a volunteer.
            </p>
        </div>
    );
}