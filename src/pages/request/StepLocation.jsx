import React from 'react';
import { useRequestForm } from '../../context/RequestFormContext';
import { MapPinIcon } from '@heroicons/react/24/outline'; // Example icon

export default function StepLocation() {
    const { form, updateForm } = useRequestForm();

    // If the task is online, this step might be skipped by logic in the context/layout,
    // but we still render conditionally here for robustness.
    if (form.isOnline) {
        return (
            <div className="text-center text-gray-600 py-4 animate-fade-in">
                <MapPinIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                No location needed for online-only requests.
            </div>
        );
    }

    const handleChange = (e) => {
        updateForm(e.target.name, e.target.value);
    };

    return (
        <div className="space-y-2 animate-fade-in">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                General Location *
            </label>
            <input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="e.g., Rafah Camp, Northern Gaza, Damascus Suburb"
                required={!form.isOnline} // Required only if not online
            />
            <p className="mt-2 text-xs text-gray-500">
                Provide a general area. For safety, **do not** enter a precise address. Volunteers see an approximate area on the map. (Required if not online)
            </p>
            {/* Optional: Add geocoding/map integration later here */}
            {/* {form.location && (
                <p className="text-sm text-blue-600 mt-2">
                    We'll show this location approximately on the map.
                </p>
            )} */}
        </div>
    );
}