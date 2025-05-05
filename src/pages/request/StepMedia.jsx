import React from 'react';
import { useRequestForm } from '../../context/RequestFormContext';
import MediaUpload from '../../components/request/MediaUpload'; // Import the component

export default function StepMedia() {
    const { form, handleMediaChange } = useRequestForm();

    return (
        <div className="animate-fade-in">
            <MediaUpload
                selectedFiles={form.media} // Pass the FileList object from context state
                onFilesChange={handleMediaChange} // Pass the context update function for media
            />
             <p className="mt-2 text-xs text-gray-500">
                Optionally add photos or short videos (e.g., picture of needed item, area if relevant and safe to share). Max 5 files.
            </p>
        </div>
    );
}