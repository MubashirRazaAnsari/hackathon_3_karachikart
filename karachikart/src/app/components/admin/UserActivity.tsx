'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  _id: string;
  _type: string;
  _createdAt: string;
  details: {
    action: string;
    name?: string;
    orderNumber?: string;
  };
}

export default function UserActivity({ activities: initialActivities }: { activities: Activity[] }) {
  const [activities, setActivities] = useState(initialActivities);

  // Poll for new activities
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      const res = await fetch('/api/admin/activities');
      const newActivities = await res.json();
      setActivities(newActivities);
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity._id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity._type === 'order' ? 'bg-blue-100' :
                activity._type === 'user' ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                {/* Add icons based on activity type */}
              </div>
            </div>
            <div>
              <p className="text-sm">
                {activity.details.action}
                {activity.details.name && <span className="font-medium"> {activity.details.name}</span>}
                {activity.details.orderNumber && <span className="font-medium"> #{activity.details.orderNumber}</span>}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(activity._createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 