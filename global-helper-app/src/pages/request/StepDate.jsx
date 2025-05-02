import React from 'react';
import { useRequestForm } from '../../context/RequestFormContext';

export default function StepDate() {
    const { form, updateForm } = useRequestForm();

    const handleChange = (e) => {
        updateForm(e.target.name, e.target.value);
    };

    // Get today's date in YYYY-MM-DD format for the min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-4 animate-fade-in">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Preferred Date *
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                    min={today} // Prevent selecting past dates
                />
                 <p className="mt-1 text-xs text-gray-500">
                    Select the earliest day the task can be done. (Required)
                </p>
            </div>

            {/* Show time input only if a date is selected */}
            {form.date && (
                <div className="animate-fade-in">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Preferred Time (Optional)
                    </label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Only add a time if the task must happen at a specific hour (e.g., for an appointment). Otherwise, leave blank for flexibility.
                    </p>
                </div>
            )}
        </div>
    );
}