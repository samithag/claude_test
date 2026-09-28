import type { Board } from "./types";

export const dummyBoard: Board = {
  title: "Product Launch",
  columns: [
    {
      id: "col-backlog",
      title: "Backlog",
      cards: [
        {
          id: "card-onboarding",
          title: "Draft onboarding emails",
          details: "Welcome sequence for new workspaces, three touchpoints.",
        },
        {
          id: "card-analytics",
          title: "Define analytics events",
          details: "Name the funnel events for signup through first board.",
        },
      ],
    },
    {
      id: "col-ready",
      title: "Ready",
      cards: [
        {
          id: "card-pricing",
          title: "Ship pricing page",
          details: "Finalize copy and layout for the public pricing table.",
        },
      ],
    },
    {
      id: "col-progress",
      title: "In Progress",
      cards: [
        {
          id: "card-auth",
          title: "Polish sign-in flow",
          details: "Tighten spacing and error states on the login screen.",
        },
        {
          id: "card-api",
          title: "Board API contract",
          details: "Align card payload fields with the frontend types.",
        },
      ],
    },
    {
      id: "col-review",
      title: "Review",
      cards: [
        {
          id: "card-brand",
          title: "Brand color pass",
          details: "Check accent yellow against navy headings in dark sections.",
        },
      ],
    },
    {
      id: "col-done",
      title: "Done",
      cards: [
        {
          id: "card-repo",
          title: "Scaffold the repository",
          details: "Next.js app, linting, and a clean project layout.",
        },
      ],
    },
  ],
};
