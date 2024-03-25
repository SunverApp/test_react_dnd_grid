import React, { useState } from "react";

import {
  DragDropContext,
  DragUpdate,
  Draggable,
  DraggableLocation,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";

// The 'data' we want to display in a dnd grid
const DEFAULT_ITEMS_LIST = [
  { id: "item-0", label: "A", color: "bg-green-500", order: 1 },
  { id: "item-1", label: "B", color: "bg-red-500", order: 2 },
  { id: "item-2", label: "C", color: "bg-blue-500", order: 3 },
  { id: "item-3", label: "D", color: "bg-yellow-500", order: 4 },
  { id: "item-4", label: "E", color: "bg-purple-500", order: 5 },
  { id: "item-5", label: "F", color: "bg-teal-500", order: 6 },
  { id: "item-6", label: "G", color: "bg-gray-500", order: 7 },
  { id: "item-7", label: "H", color: "bg-rose-500", order: 8 },
];

// just to differentiate lines in debug mode
const LINES_COLORS = [
  "bg-green-100",
  "bg-red-100",
  "bg-blue-100",
  "bg-yellow-100",
  "bg-teal-100",
  "bg-purple-100",
];

export default function App() {
  const [items, setItems] = useState(DEFAULT_ITEMS_LIST);
  const [debugMode, setDebugMode] = useState(false);
  const [maxItemsPerLine, setMaxItemsPerLine] = useState(3);
  const [nbLinesNeeded, setNbLinesNeeded] = useState(
    Math.ceil(items.length / maxItemsPerLine)
  );

  const computeIndex = (source, destination) => {
    const srcOffset = Number(source.droppableId.split("-")[1]);
    const destOffset = Number(destination.droppableId.split("-")[1]);

    let srcIndex = source.index + (srcOffset * maxItemsPerLine);
    let destiIndex = destination.index  + (destOffset * maxItemsPerLine);

    // if it stays on the same line -> easiest case
    if (srcOffset === destOffset) {
      return [srcIndex, destiIndex];
    }

    // line 0 index 0 -> nothing to do
    if (destination.index === 0 && destOffset > 0) {
      return
    }

    // last index of the line -> nothing to do
    if (destination.index === maxItemsPerLine - 1 && destOffset > 0) {
      destiIndex -= 1;
      return
    }


    // if (destination.index === 0 && destOffset > 0) {
    //   destiIndex -= 1;
    // }

    // if (line > 0 && lineIndex === 0) {
    //   index -= 1;
    // }

    return [srcIndex, destiIndex];
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const [srcIndex, destIndex] = computeIndex(source, destination);

    if (srcIndex === destIndex) {
      return;
    }

    console.log(srcIndex, " -> ", destIndex);

    const itemsCopy = [...items];
    const [removed] = itemsCopy.splice(srcIndex, 1);
    itemsCopy.splice(destIndex, 0, removed);

    for (let i = 0; i < itemsCopy.length; i++) {
      itemsCopy[i].order = i + 1;
    }
    setItems(itemsCopy);
  };

  const handleDragUpdate = (update) => {
    return
    if (!update.destination) {
      return;
    }

    if (
      update.destination === null ||
      JSON.stringify(update.source) === JSON.stringify(update.destination)
    ) {
      return;
    }

    const srcOffset = Number(update.source.droppableId.split("-")[1]);
    const destOffset = Number(update.destination.droppableId.split("-")[1]);

    const srcIndex = srcOffset * maxItemsPerLine + update.source.index;
    const destIndex = destOffset * maxItemsPerLine + update.destination.index;

    console.log(destIndex)

    if (srcIndex === destIndex) {
      return;
    }

    const itemsCopy = [...items];
    const [removed] = itemsCopy.splice(srcIndex, 1);
    itemsCopy.splice(destIndex, 0, removed);

    for (let i = 0; i < itemsCopy.length; i++) {
      itemsCopy[i].order = i + 1;
    }
    // console.log(itemsCopy)
    setItems(itemsCopy);
    console.log(update);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center px-12">
      <h1 className="font-bold text-xl mb-8">Demo dnd grid</h1>

      {/* Config buttons */}
      <div className="mt-4 border border-gray-300 rounded-sm p-8 mb-2">
        <span className="text-xl font-bold">Configuration</span>
        <div className="flex gap-x-3 pt-2">
          <span>Max items per line: </span>
          <button
            className="font-bold"
            onClick={() => {
              if (maxItemsPerLine === 1) {
                return;
              }
              setNbLinesNeeded(Math.ceil(items.length / (maxItemsPerLine - 1)));
              setMaxItemsPerLine(maxItemsPerLine - 1);
            }}
          >
            -
          </button>
          {maxItemsPerLine}
          <button
            className="font-bold"
            onClick={() => {
              setNbLinesNeeded(Math.ceil(items.length / (maxItemsPerLine + 1)));
              setMaxItemsPerLine(maxItemsPerLine + 1);
            }}
          >
            +
          </button>
        </div>
        <div className="flex gap-x-3 pt-2">
          <span>Debug mode</span>
          <input
            type="checkbox"
            value={debugMode}
            onChange={() => setDebugMode(!debugMode)}
          />
        </div>
      </div>

      <div className="flex items-center justify-center flex-col">
        <DragDropContext
          onDragEnd={handleDragEnd}
          onDragUpdate={handleDragUpdate}
        >
          {Array.from(Array(nbLinesNeeded).keys()).map((index) => {
            return (
              <Droppable
                droppableId={`droppable-${index}`}
                direction="horizontal"
                key={`droppable-${index}`}
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`${
                      debugMode ? LINES_COLORS[index % LINES_COLORS.length] : ""
                    } w-full p-2 flex items-center justify-start gap-x-2 border border-gray-200`}
                  >
                    {debugMode && <p>{`droppable-${index}`}</p>}
                    {items
                      .sort((a, b) => (a.order > b.order ? 1 : -1))
                      .slice(
                        maxItemsPerLine * index,
                        maxItemsPerLine * index + maxItemsPerLine
                      )
                      .map((item, itemIndex) => (
                        <Draggable
                          key={`list-${index}-item-${item.id}`}
                          draggableId={`list-${index}-item-${item.id}`}
                          index={itemIndex}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`size-32 ${item.color} flex flex-col items-center justify-center`}
                            >
                              <span className="font-bold">{item.label}</span>
                              {debugMode && (
                                <div className="font-light self-start pl-2">
                                  <span>{`line index: ${itemIndex} `}</span>
                                  <span>
                                    {`global index: ${
                                      index * maxItemsPerLine + itemIndex
                                    }`}
                                  </span>
                                </div>
                              )}
                            </div>
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
    </div>
  );
}
