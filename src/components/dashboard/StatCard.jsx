import React from 'react'; // Good practice to import React

// Updated StatCard component
export default function StatCard({ label, value, icon, className = "" }) { // Added className prop
  return (
    // Removed the 'border' class from here
    // Merged incoming className for flexibility from the parent
    <div className={`bg-white shadow rounded-lg p-5 text-center ${className}`}> {/* Adjusted padding/rounding to match parent's intent */}
      {/* It's common to wrap the icon for easier sizing/styling if needed */}
      <div className="flex justify-center items-center mb-2">
        {/* Clone element adds classes directly to the icon component */}
        {React.cloneElement(icon, { className: `${icon.props.className || ''} h-8 w-8 mx-auto` })}
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  );
}