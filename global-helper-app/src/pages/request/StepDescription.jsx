import React from 'react';
import { useRequestForm } from '../../context/RequestFormContext';

export default function StepDescription() {
    const { form, updateForm } = useRequestForm();

    const handleChange = (e) => {
        updateForm(e.target.name, e.target.value);
    };

    return (
        <div className="space-y-2 animate-fade-in">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Add more details *
            </label>
            <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5" // Increased rows for more space
                className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Explain the task clearly. Mention urgency, specific needs (e.g., type of medicine, quantity), any challenges, or relevant context. Remember: DO NOT include personal identifying information."
                required
            />
            <p className="mt-2 text-xs text-gray-500">
                Provide enough information for a volunteer to understand the need and assess if they can help. (Required)
            </p>
        </div>
    );
}