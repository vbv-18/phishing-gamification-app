export interface TheoryItem{
    concept: string;
    definition: string
}

export interface TheorySection{
    id: number;
    title: string;
    description: string;
    items: TheoryItem[];
}

export interface TheoryData{
    module_id: number;
    title: string;
    theory: TheorySection[];
}

export interface Module{
    id: number;
    title: string;
    all_completed: boolean;
    theory: TheorySection[];
    theory_seen: boolean;
}