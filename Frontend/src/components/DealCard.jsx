export default function DealCard({ deal, onDelete, onEdit }) {
  // Use a fallback for timestamp if missing or local (like optimistic update)
  const dateStr = deal.createdAt && deal.createdAt.toDate 
    ? deal.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : "Just now";

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Idea': return 'bg-gray-700 text-gray-300 border-gray-600';
      case 'Seed': return 'bg-blue-900/50 text-blue-300 border-blue-800/50';
      case 'Series A': return 'bg-indigo-900/50 text-indigo-300 border-indigo-800/50';
      default: return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Interested': return 'text-yellow-400';
      case 'Contacted': return 'text-blue-400';
      case 'Invested': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{deal.startupName}</h3>
          <span className="text-xs font-medium text-gray-500 bg-gray-900 px-2.5 py-1 rounded-md">{dateStr}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getStageColor(deal.stage)}`}>
            {deal.stage}
          </span>
          <span className="px-2.5 py-1 bg-gray-900 border border-gray-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full bg-current ${getStatusColor(deal.status)}`}></span>
            <span className="text-gray-300">{deal.status}</span>
          </span>
        </div>

        {deal.notes && (
          <div className="mb-4">
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {deal.notes}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(deal)} 
          className="text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(deal.id)} 
          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
