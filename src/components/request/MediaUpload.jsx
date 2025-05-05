import React, { useState, useRef, useCallback } from 'react';
import { ArrowUpTrayIcon, XCircleIcon } from '@heroicons/react/24/outline'; // Example icons

export default function MediaUpload({ selectedFiles, onFilesChange }) {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    // Drag handlers
    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    // Drop handler
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesChange(e.dataTransfer.files); // Pass FileList up
        }
    }, [onFilesChange]);

    // Input change handler
    const handleInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesChange(e.target.files); // Pass FileList up
        }
    };

    // Clear selection handler
    const clearSelection = (e) => {
         e.stopPropagation(); // Prevent triggering the file input click
         onFilesChange(null); // Clear files in parent state
         if(fileInputRef.current) {
             fileInputRef.current.value = ""; // Reset the input visually
         }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Generate a preview list (optional, can get complex)
    const renderFilePreview = () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            return (
                <>
                    <ArrowUpTrayIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <span className="block text-sm font-medium text-emerald-700">
                        Click or drag & drop files
                    </span>
                    <span className="block text-xs text-gray-500">Images or short videos (optional)</span>
                </>
            );
        }

        // Convert FileList to array for mapping
        const filesArray = Array.from(selectedFiles);

        return (
            <div className='space-y-1 text-left'>
                 <p className="text-sm font-medium text-gray-700 mb-1">{filesArray.length} file(s) selected:</p>
                <ul className='list-disc list-inside text-xs text-gray-600 max-h-20 overflow-y-auto'>
                    {filesArray.map((file, index) => (
                        <li key={index} className='truncate'>{file.name}</li>
                    ))}
                </ul>
            </div>

        );
    };

    return (
        <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Photos/Videos (Optional)
            </label>
            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`relative mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 ${
                dragActive
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-300 border-dashed"
                } rounded-md cursor-pointer hover:border-emerald-400 transition duration-150 ease-in-out group`}
                style={{ minHeight: '100px' }} // Ensure drop zone has height
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    name="media"
                    onChange={handleInputChange}
                    accept="image/*,video/*" // Adjust accepted types as needed
                    multiple
                    className="hidden" // Hide the actual input
                />
                <div className="text-center">
                    {renderFilePreview()}
                </div>
                 {selectedFiles && selectedFiles.length > 0 && (
                     <button
                        type="button"
                        onClick={clearSelection}
                        className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-500 rounded-full bg-white bg-opacity-75"
                        title="Clear selection"
                        aria-label="Clear media selection"
                     >
                        <XCircleIcon className="h-5 w-5" />
                     </button>
                 )}
            </div>
        </div>
    );
}