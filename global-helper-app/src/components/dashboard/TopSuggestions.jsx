export default function TopSuggestions({ isVolunteer }) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-medium mb-2">Top Suggestions</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {isVolunteer ? (
            <>
              <li>Browse new requests from crisis areas</li>
              <li>Earn more compassion points by taking urgent tasks</li>
              <li>Check your badge progress on your profile</li>
            </>
          ) : (
            <>
              <li>Post a new task if you need help</li>
              <li>View your past requests and their status</li>
              <li>Update your profile with more details</li>
            </>
          )}
        </ul>
      </div>
    );
  }
  