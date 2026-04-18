import MultipleChoice from "@/components/levels/MultipleChoice";
import { ExerciseRenderProps } from "@/types/renderer";
import React, { ReactElement } from "react";

export const TYPES: Record<string, (props: ExerciseRenderProps) => React.ReactElement> = { //level mechanic -> renderer component
    multiple_choice: MultipleChoice,
};
