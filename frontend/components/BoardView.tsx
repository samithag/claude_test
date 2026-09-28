"use client";

import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useRef, useState } from "react";
import { CardModal } from "@/components/CardModal";
import { KanbanColumn } from "@/components/KanbanColumn";
import {
  addCard,
  applyCardOrder,
  cardOrder,
  deleteCard,
  renameColumn,
  updateCard,
} from "@/lib/board";
import { dummyBoard } from "@/lib/dummy-board";
import type { Board, Card } from "@/lib/types";

type ModalState =
  | { mode: "add"; columnId: string }
  | { mode: "edit"; card: Card }
  | null;

export function BoardView() {
  const [board, setBoard] = useState<Board>(dummyBoard);
  const [modal, setModal] = useState<ModalState>(null);
  const previousItems = useRef(cardOrder(board));

  return (
    <div className="flex min-h-full flex-col bg-[#f3f6fa]">
      <header className="px-8 pb-4 pt-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
          Kanban
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">
          {board.title}
        </h1>
        <div className="mt-3 h-1 w-16 rounded-full bg-accent" />
      </header>
      <DragDropProvider
        onDragStart={() => {
          previousItems.current = cardOrder(board);
        }}
        onDragOver={(event) => {
          const { source } = event.operation;
          if (!source || source.type === "column") {
            return;
          }
          setBoard((current) =>
            applyCardOrder(current, move(cardOrder(current), event)),
          );
        }}
        onDragEnd={(event) => {
          if (event.canceled) {
            setBoard((current) => applyCardOrder(current, previousItems.current));
          }
        }}
      >
        <div
          data-testid="board"
          className="flex flex-1 gap-4 overflow-x-auto px-8 pb-10"
        >
          {board.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onRename={(title) =>
                setBoard((current) => renameColumn(current, column.id, title))
              }
              onAdd={() => setModal({ mode: "add", columnId: column.id })}
              onOpenCard={(card) => setModal({ mode: "edit", card })}
            />
          ))}
        </div>
      </DragDropProvider>
      {modal?.mode === "add" ? (
        <CardModal
          heading="New card"
          submitLabel="Add card"
          initialTitle=""
          initialDetails=""
          onClose={() => setModal(null)}
          onSubmit={(input) => {
            setBoard((current) => addCard(current, modal.columnId, input));
            setModal(null);
          }}
        />
      ) : null}
      {modal?.mode === "edit" ? (
        <CardModal
          heading="Edit card"
          submitLabel="Save"
          initialTitle={modal.card.title}
          initialDetails={modal.card.details}
          onClose={() => setModal(null)}
          onSubmit={(input) => {
            setBoard((current) => updateCard(current, modal.card.id, input));
            setModal(null);
          }}
          onDelete={() => {
            setBoard((current) => deleteCard(current, modal.card.id));
            setModal(null);
          }}
        />
      ) : null}
    </div>
  );
}
