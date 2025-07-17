// src/components/StatCard.jsx
const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow text-center">
    <h2 className="text-lg font-medium text-gray-600">{title}</h2>
    <p className="text-3xl font-bold text-indigo-600 mt-2">{value}</p>
  </div>
);

export default StatCard;
