export interface Theory{
    id: number;
    text: string
}

export interface Module{
    id: number;
    title: string;
    all_completed: boolean;
    theory: Theory[];
}