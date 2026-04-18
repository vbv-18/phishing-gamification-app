export interface Option{
    id: string;
    text: string;
}

export interface Question{
    id: number;
    context: string;
    text: string;
    options: Option[];
}