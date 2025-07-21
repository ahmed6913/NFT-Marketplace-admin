// src/components/Notifications.jsx
const Notifications = ({ notifications, open }) => {
  if (!open) return null;
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 p-4 rounded-2xl shadow-xl z-50">
      <ul className="space-y-2">
        {notifications.length === 0 ? (
          <li className="text-slate-500">No notifications</li>
        ) : notifications.map((note, index) => (
          <li key={index} className="text-slate-600 border-l-4 border-blue-500 pl-3">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
