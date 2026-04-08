import { useState, useEffect } from "react";
import { addDeal, updateDeal } from "../services/dealService";

export default function DealForm({ onDealSaved, initialData = null, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    startupName: "",
    stage: "Idea",
    status: "Interested",
    notes: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        startupName: initialData.startupName || initialData.startup_name || "",
        stage: initialData.stage || "Idea",
        status: initialData.status || "Interested",
        notes: initialData.notes || ""
      });
    } else {
      setFormData({ startupName: "", stage: "Idea", status: "Interested", notes: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startupName) return alert("Startup name is required");
    
    setIsSubmitting(true);
    
    try {
      if (initialData && initialData.id) {
        await updateDeal(initialData.id, formData);
      } else {
        await addDeal(formData);
      }
      setFormData({ startupName: "", stage: "Idea", status: "Interested", notes: "" });
      onDealSaved();
    } catch (error) {
      console.error(error);
      alert(error?.message || "Failed to save deal - Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block tracking-wide text-xs font-bold text-gray-400 uppercase mb-2">Startup Name</label>
        <input 
          name="startupName"
          placeholder="e.g. Acme Corp" 
          value={formData.startupName}
          onChange={handleChange} 
          className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500" 
          required
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex-1">
          <label className="block tracking-wide text-xs font-bold text-gray-400 uppercase mb-2">Stage</label>
          <select 
            name="stage" 
            value={formData.stage} 
            onChange={handleChange} 
            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="Idea">Idea</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block tracking-wide text-xs font-bold text-gray-400 uppercase mb-2">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="Interested">Interested</option>
            <option value="Contacted">Contacted</option>
            <option value="Invested">Invested</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block tracking-wide text-xs font-bold text-gray-400 uppercase mb-2">Notes</label>
        <textarea 
          name="notes"
          placeholder="Add important details here..." 
          value={formData.notes}
          onChange={handleChange} 
          className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500 resize-none" 
          rows="4"
        />
      </div>

      <div className="flex gap-4 mt-2">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:shadow-none"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              Saving...
            </span>
          ) : initialData ? "Update Deal" : "Save Deal"}
        </button>
      </div>
    </form>
  );
}
