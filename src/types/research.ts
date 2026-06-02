export type ResearchSectionId =
  | "worked"
  | "risks"
  | "overfitting"
  | "costs"
  | "benchmark"
  | "stability"
  | "improvements";

export type ResearchNoteSection = {
  id: ResearchSectionId;
  title: string;
  body: string;
};

export type ResearchNotes = {
  strategySummary: string;
  sections: ResearchNoteSection[];
  disclaimer: string;
};
