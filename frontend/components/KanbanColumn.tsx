"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";
import { useState } from "react";
import { KanbanCard } from "@/components/KanbanCard";
import type { Card, Column } from "@/lib/types";

type KanbanColumnProps = {
  column: Column;
  onRename: (title: string) => void;
  onAdd: () => void;
  onOpenCard: (card: Card) => void;
};

export function KanbanColumn({
  column,
  onRename,
  onAdd,
  onOpenCard,
}: KanbanColumnProps) {
  const { ref, isDropTarget } = useDroppable({
    id: column.id,
    type: "column",
    accept: "item",
    collisionPriority: CollisionPriority.Low,
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(column.title);

  function commitRename() {
    const next = draft.trim();
    setEditing(false);
    if (next && next !== column.title) {
      onRename(next);
    } else {
      setDraft(column.title);
    }
  }

  return (
    <section
      ref={ref}
      data-testid={`column-${column.id}`}
      className={`flex w-72 shrink-0 flex-col rounded-2xl bg-white/90 shadow-sm ring-1 ring-slate-200/80 ${
        isDropTarget ? "ring-2 ring-accent" : ""
      }`}
    >
      <header className="border-b border-slate-100 px-4 pb-3 pt-4">
        <div className="mb-2 h-1 w-10 rounded-full bg-accent" />
        {editing ? (
          <input
            aria-label="Column name"
            className="w-full rounded-md border border-slate-200 px-2 py-1 text-base font-semibold text-navy outline-none ring-accent/40 focus:ring-2"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                commitRename();
              }
              if (event.key === "Escape") {
                setDraft(column.title);
                setEditing(false);
              }
            }}
            autoFocus
          />
        ) : (
          <button
            type="button"
            data-testid={`column-title-${column.id}`}
            className="w-full text-left text-base font-semibold text-navy"
            onClick={() => {
              setDraft(column.title);
              setEditing(true);
            }}
          >
            {column.title}
          </button>
        )}
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
          {column.cards.length} {column.cards.length === 1 ? "card" : "cards"}
        </p>
      </header>
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        {column.cards.map((card, index) => (
          <KanbanCard
            key={card.id}
            card={card}
            index={index}
            columnId={column.id}
            onOpen={() => onOpenCard(card)}
          />
        ))}
        <button
          type="button"
          data-testid={`add-card-${column.id}`}
          className="mt-auto rounded-xl border border-dashed border-slate-200 px-3 py-2 text-sm font-medium text-primary hover:border-primary/40 hover:bg-primary/5"
          onClick={onAdd}
        >
          Add card
        </button>
      </div>
    </section>
  );
}
