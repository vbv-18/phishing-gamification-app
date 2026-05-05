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
    url: {display_link: string; full: string; segments: UrlSegment[]};
}

export interface FileChoiceQuestion extends MultipleChoiceQuestion{
    file_name: string;
    icon_type: string;
}

export interface SimulationQuestion extends BaseQuestion{
    type: 'email' | 'sms';
    email?: {from: string; subject: string; body: string;};
    sms?: {from: string; number: string; body: string;};
}

export type Question = MultipleChoiceQuestion | DomainAnalysisQuestion | FileChoiceQuestion | SimulationQuestion;