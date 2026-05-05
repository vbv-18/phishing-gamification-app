export interface Theory{
    id: number;
    text: string
}

export interface Module{
    id: number;
    title: string;
    theory: Theory[];
}