// src/components/Notifications.jsx
const Notifications = ({ notifications }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Live Notifications</h2>
    <ul className="space-y-2">
      {notifications.map((note, index) => (
        <li key={index} className="text-gray-600 border-l-4 border-indigo-500 pl-3">
          {note}
        </li>
      ))}
    </ul>
  </div>
);

export default Notifications;
