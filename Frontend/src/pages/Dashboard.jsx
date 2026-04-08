/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  deleteDeal,
  updateDeal,
  getDeals,
} from "../services/dealService";
import DealForm from "../components/DealForm";
import DealCard from "../components/DealCard";
import Navbar from "../components/Navbar";
import { auth } from "../services/firebase";
import KanbanBoard from "../components/KanbanBoard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { supabase } from "../services/supabase";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  // Filters and Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
  const fetchDeals = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const normalizedDeals = (data || []).map((deal) => ({
        ...deal,
        startupName: deal.startupName || deal.startup_name || deal.name || "",
      }));

      setDeals(normalizedDeals);
    } catch (err) {
      console.error("Supabase Error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchDeals();

  const channel = supabase
    .channel("deals")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "deals" },
      () => {
        fetchDeals(); // refresh
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, []);

  const handleDelete = async (id) => {
  if (window.confirm("Are you sure?")) {
    setDeals((prev) => prev.filter((deal) => deal.id !== id));
    try {
      await deleteDeal(id);
    } catch (err) {
      console.error("Deletion failed:", err);
    }
  }
};

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setShowForm(true);
  };

  const handleDealSaved = () => {
    setShowForm(false);
    setEditingDeal(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDeal(null);
  };

  // Filter deals based on search term, stage, and status
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // Safely access startupName or fallback to 'name' (for older deals added before the rename)
      const nameForSearch = deal.startup_name || deal.startupName || "";

      const matchesSearch = nameForSearch
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStage = filterStage === "All" || deal.stage === filterStage;
      const matchesStatus =
        filterStatus === "All" || deal.status === filterStatus;

      return matchesSearch && matchesStage && matchesStatus;
    });
  }, [deals, searchTerm, filterStage, filterStatus]);


  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const dealId = result.draggableId;
    const newStage = result.destination.droppableId;

    try {
      setDeals((prevDeals) =>
        prevDeals.map((deal) =>
          deal.id === dealId ? { ...deal, stage: newStage } : deal,
        ),
      );
      
      await updateDeal( dealId, {
        stage: newStage,
      });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <Navbar />
      <div className="px-6 py-8 max-w-400 w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Deals
          </h1>
          <button
            onClick={() => {
              setEditingDeal(null);
              setShowForm(true);
            }}
            className="bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition"
          >
            + Add New Deal
          </button>
        </div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-150 overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {editingDeal ? "Edit Deal Details" : "Create New Deal"}
              </DialogTitle>
              <DialogDescription>
                {editingDeal
                  ? "Make changes to your selected deal here."
                  : "Enter the details for the new startup deal."}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2">
              <DealForm
                initialData={editingDeal}
                onDealSaved={handleDealSaved}
                onCancel={handleCancel}
              />
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column - Kanban Board (3.5 parts) */}
          <div className="w-full" style={{ flex: 3.5 }}>
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-sm overflow-x-auto">
              <KanbanBoard deals={filteredDeals} onDragEnd={handleDragEnd} />
            </div>
          </div>

          {/* Right Column - Search, Filters, and List (1.5 parts) */}
          <div className="w-full flex-col flex gap-6" style={{ flex: 1.5 }}>
            {/* Filters and Search */}
            <div className="bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-700 flex flex-col gap-4">
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Search startups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white pl-4 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="All">All Stages</option>
                  <option value="Idea">Idea</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="All">All Statuses</option>
                  <option value="Interested">Interested</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Invested">Invested</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredDeals.length === 0 ? (
              <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700 shadow-sm">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl opacity-50">📂</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No deals found
                </h3>
                <p className="text-gray-400 max-w-xs mx-auto">
                  {deals.length === 0 && !showForm
                    ? "You haven't added any deals yet. Click 'Add New Deal' to get started."
                    : "Try adjusting your search or filters to find what you're looking for."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 overflow-y-auto max-h-[800px] pb-4 no-scrollbar">
                {filteredDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
