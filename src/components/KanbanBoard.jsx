import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const columns = ["Idea", "Seed", "Series A"];

export default function KanbanBoard({ deals, onDragEnd }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        {columns.map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`rounded-2xl p-4 min-h-100 transition
                  ${snapshot.isDraggingOver ? "bg-blue-900/40" : "bg-[#0f172a]"}
                `}
              >
                {/* Column Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white font-semibold text-lg">
                    {col}
                  </h2>
                  <span className="text-sm text-gray-400">
                    {deals.filter(d => d.stage === col).length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {deals
                    .filter((deal) => deal.stage === col)
                    .map((deal, index) => (
                      <Draggable
                        key={deal.id}
                        draggableId={deal.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded-xl shadow-md cursor-pointer transition
                              ${snapshot.isDragging
                                ? "bg-blue-500 text-white"
                                : "bg-[#1e293b] text-white hover:bg-[#334155]"
                              }
                            `}
                          >
                            <h3 className="font-semibold text-md">
                              {deal.startupName}
                            </h3>

                            <p className="text-sm text-gray-400 mt-1">
                              {deal.status}
                            </p>

                            <div className="flex justify-between items-center mt-3">
                              <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                                {deal.stage}
                              </span>

                              <span className="text-xs text-gray-500">
                                {deal.createdAt?.seconds
                                  ? new Date(deal.createdAt.seconds * 1000).toLocaleDateString()
                                  : ""}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}

      </div>
    </DragDropContext>
  );
}