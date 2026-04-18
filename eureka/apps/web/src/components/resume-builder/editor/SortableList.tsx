"use client";

import { useState, useRef, type ReactNode } from "react";
import { GripVertical } from "lucide-react";

interface SortableListProps<T> {
  items: T[];
  getKey: (item: T) => string;
  onReorder: (newItems: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
}

/**
 * Lightweight native HTML5 drag-and-drop sortable list.
 * No external dependencies — works in all browsers.
 */
export function SortableList<T>({ items, getKey, onReorder, renderItem }: SortableListProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragRef = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
    dragRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const fromIndex = dragRef.current;
    if (fromIndex === null || fromIndex === dropIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    const newItems = [...items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(dropIndex, 0, moved);
    onReorder(newItems);

    setDragIndex(null);
    setOverIndex(null);
    dragRef.current = null;
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
    dragRef.current = null;
  };

  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <div
          key={getKey(item)}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`relative transition-all ${
            dragIndex === index ? "opacity-40 scale-95" : ""
          } ${
            overIndex === index && dragIndex !== index
              ? "border-t-2 border-primary pt-1"
              : ""
          }`}
        >
          <div className="flex items-start gap-0">
            <div
              className="cursor-grab active:cursor-grabbing p-1 mt-2 rounded hover:bg-muted flex-shrink-0"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40" />
            </div>
            <div className="flex-1 min-w-0">
              {renderItem(item, index)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
