"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import type { Card } from "@/lib/types";

type KanbanCardProps = {
  card: Card;
  index: number;
  columnId: string;
  onOpen: () => void;
};

export function KanbanCard({ card, index, columnId, onOpen }: KanbanCardProps) {
  const { ref, isDragSource } = useSortable({
    id: card.id,
    index,
    type: "item",
    accept: "item",
    group: columnId,
  });

  return (
    <div data-testid={`card-${card.id}`}>
      <button
        ref={ref}
        type="button"
        aria-label={card.title}
        className={`w-full rounded-xl border border-slate-200/80 bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
          isDragSource ? "opacity-40" : ""
        }`}
        onClick={onOpen}
      >
        <p className="font-medium text-navy">{card.title}</p>
        {card.details ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted">
            {card.details}
          </p>
        ) : null}
      </button>
    </div>
  );
}
