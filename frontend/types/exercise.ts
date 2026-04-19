export interface BaseQuestion{
    id: number;
    context: string;
}

export interface Option{ //module 1
    id: string;
    text: string;
}

export interface UrlSegment{ //DomainAnalysis
    type: string;
    value: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion{
    text: string;
    options: Option[];
}

export interface DomainAnalysisQuestion extends BaseQuestion{
    email: {from: string; subject: string; body: string; display_link?: string;};
    url: {full: string; segments: UrlSegment[]};
}

export type Question = MultipleChoiceQuestion | DomainAnalysisQuestion;