// src/components/StatCard.jsx
const StatCard = ({ title, value }) => (
  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl text-center transition hover:shadow-2xl">
    <h2 className="text-lg font-medium text-slate-600">{title}</h2>
    <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
  </div>
);

export default StatCard;
