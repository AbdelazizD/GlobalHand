import React from 'react';
import { useRequestForm } from '../../context/RequestFormContext';

export default function StepTitle() {
    const { form, updateForm } = useRequestForm();

    const handleChange = (e) => {
        updateForm(e.target.name, e.target.value);
    };

    return (
        <div className="space-y-2 animate-fade-in"> {/* Added simple animation class */}
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                In a few words, what do you need done? *
            </label>
            <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="e.g. Need medicine delivery near Rafah"
                required
                autoFocus // Focus on the first input of the form
            />
            <p className="mt-2 text-xs text-gray-500">
                Keep it concise. You can add more details later. (Required)
            </p>
        </div>
    );
}