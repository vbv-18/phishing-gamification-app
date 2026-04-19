import DomainAnalysis from "@/components/levels/DomainAnalysis";
import MultipleChoice from "@/components/levels/MultipleChoice";
import { ExerciseRenderProps } from "@/types/renderer";
import React from "react";

export const TYPES: Record<string, (props: ExerciseRenderProps) => React.ReactElement | null> = { //level mechanic -> renderer component
    multiple_choice: MultipleChoice,
    highlight: DomainAnalysis,
};
