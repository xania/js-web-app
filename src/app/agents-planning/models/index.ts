export interface Position {
    id: string;
    name: string;
    shorthand: string;
    children: Position[];
}

export interface DailyDemand {
    positionId: string;
    values: number[];
}

export interface PlanCell {
    supply: number;
    demand: number;
}
