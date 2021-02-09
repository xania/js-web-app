export interface Position {
    id: string;
    name: string;
    children: Position[];
}

export interface DailyDemand {
    positionId: string;
    values: number[];
}
