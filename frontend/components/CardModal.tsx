"use client";

import { useState } from "react";

type CardModalProps = {
  heading: string;
  submitLabel: string;
  initialTitle: string;
  initialDetails: string;
  onSubmit: (input: { title: string; details: string }) => void;
  onDelete?: () => void;
  onClose: () => void;
};

export function CardModal({
  heading,
  submitLabel,
  initialTitle,
  initialDetails,
  onSubmit,
  onDelete,
  onClose,
}: CardModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [details, setDetails] = useState(initialDetails);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/45 px-4"
      onClick={onClose}
    >
      <form
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim()) {
            return;
          }
          onSubmit({ title: title.trim(), details: details.trim() });
        }}
      >
        <h2 className="text-lg font-semibold text-navy">{heading}</h2>
        <label className="mt-5 block text-sm font-medium text-muted" htmlFor="card-title">
          Title
        </label>
        <input
          id="card-title"
          className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-navy outline-none ring-accent/40 focus:ring-2"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          autoFocus
          required
        />
        <label className="mt-4 block text-sm font-medium text-muted" htmlFor="card-details">
          Details
        </label>
        <textarea
          id="card-details"
          className="mt-1.5 min-h-28 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-navy outline-none ring-accent/40 focus:ring-2"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
        />
        <div className="mt-6 flex items-center justify-between gap-3">
          {onDelete ? (
            <button
              type="button"
              data-testid="card-delete"
              className="text-sm font-medium text-muted hover:text-red-600"
              onClick={onDelete}
            >
              Delete
            </button>
          ) : (
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline"
              onClick={onClose}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            data-testid="card-submit"
            className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary/90"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
