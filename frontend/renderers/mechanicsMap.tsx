import DomainAnalysis from "@/components/levels/DomainAnalysis";
import EmailSimulation from "@/components/levels/EmailSimulation";
import MultipleChoice from "@/components/levels/MultipleChoice";
import FileChoice from "@/components/levels/FileChoice";
import { ExerciseRenderProps } from "@/types/renderer";
import React from "react";

export const TYPES: Record<string, (props: ExerciseRenderProps) => React.ReactElement | null> = { //level mechanic -> renderer component
    multiple_choice: MultipleChoice,
    highlight: DomainAnalysis,
    phishing_simulation: EmailSimulation,
    file_choice: FileChoice,
};
