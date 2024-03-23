import React, { useState } from "react";

import {
  DragDropContext,
  Draggable,
  Droppable,
} from "@hello-pangea/dnd";

// The 'data' we want to display in a dnd grid
const COLORS = [
  { id: "item-0", color: "bg-green-500", order: 1 },
  { id: "item-1", color: "bg-red-500", order: 2 },
  { id: "item-2", color: "bg-blue-500", order: 3 },
  { id: "item-3", color: "bg-yellow-500", order: 4 },
  { id: "item-4", color: "bg-purple-500", order: 5 },
  { id: "item-5", color: "bg-teal-500", order: 6 },
  { id: "item-6", color: "bg-black", order: 7 },
  { id: "item-7", color: "bg-white", order: 8 },
];

// just to differentiate lines
const LINES_COLORS = [
  "bg-green-100",
  "bg-red-100",
  "bg-blue-100",
  "bg-yellow-100",
  "bg-teal-100",
  "bg-purple-100",
];

export default function App() {
  const [items, setItems] = useState(COLORS);
  const [maxItemsPerLine, setMaxItemsPerLine] = useState(3);
  const [nbLinesNeeded, setNbLinesNeeded] = useState(
    Math.ceil(items.length / maxItemsPerLine)
  );

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination || source.index === destination.index) {
      return;
    }

    const itemsCopy = [...items];
    const [removed] = itemsCopy.splice(source.index, 1);
    itemsCopy.splice(destination.index, 0, removed);

    for (let i = 0; i < itemsCopy.length; i++) {
      itemsCopy[i].order = i + 1;
    }

    setItems(itemsCopy);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center px-12">
      <h1 className="font-bold text-xl mb-8">Demo dnd grid</h1>

      {/* Config buttons */}
      <div className="self-start mt-4 border border-gray-300 rounded-sm w-full p-8">
        <span className="text-xl font-bold">Configuration</span>
        <div className="flex gap-x-3 pt-2">
          <span>Max items per line: </span>
          <button
            className="font-bold"
            onClick={() => {
              if (maxItemsPerLine === 1) {
                return
              }
              setNbLinesNeeded(Math.ceil(items.length / ( maxItemsPerLine - 1 )));
              setMaxItemsPerLine(maxItemsPerLine - 1);
            }}
          >
            -
          </button>
          {maxItemsPerLine}
          <button
            className="font-bold"
            onClick={() => {
              setNbLinesNeeded(Math.ceil(items.length / ( maxItemsPerLine + 1 )));
              setMaxItemsPerLine(maxItemsPerLine + 1);
            }}
          >
            +
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {Array.from(Array(nbLinesNeeded).keys()).map((index) => {
          return (
            <Droppable
              droppableId={`droppable-${index}`}
              direction="horizontal"
              key={`droppable-${index}`}
            >
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`${
                    LINES_COLORS[index % LINES_COLORS.length]
                  } w-full h-32 flex items-center justify-evenly`}
                >
                  <p>{`droppable-${index}`}</p>
                  {items
                    .sort((a, b) => (a.order > b.order ? 1 : -1))
                    .map((item, itemIndex) => (
                      <Draggable
                        key={`list-${index}-item-${item.id}`}
                        draggableId={`list-${index}-item-${item.id}`}
                        index={itemIndex}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`size-16 ${item.color}`}
                          />
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </DragDropContext>

    </div>
  );
}
