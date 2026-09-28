import type { Board, Card } from "./types";

export function renameColumn(
  board: Board,
  columnId: string,
  title: string,
): Board {
  if (!board.columns.some((column) => column.id === columnId)) {
    return board;
  }
  return {
    ...board,
    columns: board.columns.map((column) =>
      column.id === columnId ? { ...column, title } : column,
    ),
  };
}

export function addCard(
  board: Board,
  columnId: string,
  input: { title: string; details: string },
): Board {
  if (!board.columns.some((column) => column.id === columnId)) {
    return board;
  }
  const card: Card = {
    id: crypto.randomUUID(),
    title: input.title,
    details: input.details,
  };
  return {
    ...board,
    columns: board.columns.map((column) =>
      column.id === columnId
        ? { ...column, cards: [...column.cards, card] }
        : column,
    ),
  };
}

export function deleteCard(board: Board, cardId: string): Board {
  if (!board.columns.some((column) => column.cards.some((card) => card.id === cardId))) {
    return board;
  }
  return {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    })),
  };
}

export function updateCard(
  board: Board,
  cardId: string,
  updates: { title: string; details: string },
): Board {
  if (!board.columns.some((column) => column.cards.some((card) => card.id === cardId))) {
    return board;
  }
  return {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.cards.map((card) =>
        card.id === cardId ? { ...card, ...updates } : card,
      ),
    })),
  };
}

export function moveCard(
  board: Board,
  cardId: string,
  targetColumnId: string,
  targetIndex: number,
): Board {
  let moving: Card | undefined;
  const without = board.columns.map((column) => {
    const found = column.cards.find((card) => card.id === cardId);
    if (found) {
      moving = found;
    }
    return {
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    };
  });
  if (!moving) {
    return board;
  }
  const card = moving;
  const target = without.find((column) => column.id === targetColumnId);
  if (!target) {
    return board;
  }
  const index = Math.max(0, Math.min(targetIndex, target.cards.length));
  return {
    ...board,
    columns: without.map((column) => {
      if (column.id !== targetColumnId) {
        return column;
      }
      const cards = [...column.cards];
      cards.splice(index, 0, card);
      return { ...column, cards };
    }),
  };
}

export function cardOrder(board: Board): Record<string, string[]> {
  return Object.fromEntries(
    board.columns.map((column) => [
      column.id,
      column.cards.map((card) => card.id),
    ]),
  );
}

export function applyCardOrder(
  board: Board,
  order: Record<string, string[]>,
): Board {
  const byId = new Map(
    board.columns.flatMap((column) =>
      column.cards.map((card) => [card.id, card] as const),
    ),
  );
  return {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      cards: (order[column.id] ?? []).flatMap((id) => {
        const card = byId.get(id);
        return card ? [card] : [];
      }),
    })),
  };
}
