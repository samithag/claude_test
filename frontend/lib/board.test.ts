import { describe, expect, it, vi } from "vitest";
import {
  addCard,
  applyCardOrder,
  deleteCard,
  moveCard,
  renameColumn,
  updateCard,
} from "./board";
import { dummyBoard } from "./dummy-board";

describe("dummy board", () => {
  it("has exactly five columns and several cards", () => {
    expect(dummyBoard.columns).toHaveLength(5);
    const cardCount = dummyBoard.columns.reduce(
      (sum, column) => sum + column.cards.length,
      0,
    );
    expect(cardCount).toBeGreaterThan(4);
  });
});

describe("renameColumn", () => {
  it("renames the matching column", () => {
    const next = renameColumn(dummyBoard, "col-backlog", "Icebox");
    expect(next.columns[0].title).toBe("Icebox");
    expect(next.columns).toHaveLength(5);
  });

  it("returns the same board for an unknown column", () => {
    expect(renameColumn(dummyBoard, "missing", "X")).toBe(dummyBoard);
  });
});

describe("addCard", () => {
  it("appends a card to the given column", () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue("card-new");
    const next = addCard(dummyBoard, "col-done", {
      title: "Write docs",
      details: "README run steps",
    });
    expect(next.columns[4].cards.at(-1)).toEqual({
      id: "card-new",
      title: "Write docs",
      details: "README run steps",
    });
    expect(next.columns).toHaveLength(5);
  });

  it("returns the same board for an unknown column", () => {
    expect(
      addCard(dummyBoard, "missing", { title: "X", details: "" }),
    ).toBe(dummyBoard);
  });
});

describe("deleteCard", () => {
  it("removes the card from its column", () => {
    const next = deleteCard(dummyBoard, "card-pricing");
    expect(
      next.columns.some((column) =>
        column.cards.some((card) => card.id === "card-pricing"),
      ),
    ).toBe(false);
    expect(next.columns).toHaveLength(5);
  });

  it("returns the same board for an unknown card", () => {
    expect(deleteCard(dummyBoard, "missing")).toBe(dummyBoard);
  });
});

describe("updateCard", () => {
  it("updates title and details", () => {
    const next = updateCard(dummyBoard, "card-auth", {
      title: "Login polish",
      details: "Focus on errors",
    });
    const card = next.columns
      .flatMap((column) => column.cards)
      .find((item) => item.id === "card-auth");
    expect(card).toEqual({
      id: "card-auth",
      title: "Login polish",
      details: "Focus on errors",
    });
  });

  it("returns the same board for an unknown card", () => {
    expect(
      updateCard(dummyBoard, "missing", { title: "X", details: "Y" }),
    ).toBe(dummyBoard);
  });
});

describe("moveCard", () => {
  it("moves a card across columns", () => {
    const next = moveCard(dummyBoard, "card-onboarding", "col-done", 0);
    expect(
      next.columns.find((column) => column.id === "col-backlog")?.cards,
    ).not.toContainEqual(
      expect.objectContaining({ id: "card-onboarding" }),
    );
    expect(next.columns.find((column) => column.id === "col-done")?.cards[0].id).toBe(
      "card-onboarding",
    );
  });

  it("reorders within a column", () => {
    const next = moveCard(dummyBoard, "card-analytics", "col-backlog", 0);
    expect(
      next.columns.find((column) => column.id === "col-backlog")?.cards.map(
        (card) => card.id,
      ),
    ).toEqual(["card-analytics", "card-onboarding"]);
  });

  it("returns the same board for unknown ids", () => {
    expect(moveCard(dummyBoard, "missing", "col-done", 0)).toBe(dummyBoard);
    expect(moveCard(dummyBoard, "card-onboarding", "missing", 0)).toBe(
      dummyBoard,
    );
  });
});

describe("applyCardOrder", () => {
  it("rebuilds card lists from an id map", () => {
    const next = applyCardOrder(dummyBoard, {
      "col-backlog": ["card-analytics"],
      "col-ready": ["card-onboarding", "card-pricing"],
      "col-progress": ["card-auth", "card-api"],
      "col-review": ["card-brand"],
      "col-done": ["card-repo"],
    });
    expect(
      next.columns.find((column) => column.id === "col-ready")?.cards.map(
        (card) => card.id,
      ),
    ).toEqual(["card-onboarding", "card-pricing"]);
  });
});
