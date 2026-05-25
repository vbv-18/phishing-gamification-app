import DomainAnalysis from "@/components/levels/DomainAnalysis";
import SocialSimulation from "@/components/levels/SocialSimulation";
import MultipleChoice from "@/components/levels/MultipleChoice";
import FileChoice from "@/components/levels/FileChoice";
import SortSteps from "@/components/levels/SortSteps";
import Match from "@/components/levels/Match";
import { ExerciseRenderProps } from "@/types/renderer";
import React from "react";

export const TYPES: Record<string, (props: ExerciseRenderProps) => React.ReactElement | null> = { //level mechanic -> renderer component
    multiple_choice: MultipleChoice,
    highlight: DomainAnalysis,
    social_simulation: SocialSimulation,
    file_choice: FileChoice,
    sort: SortSteps,
    match: Match,
};
