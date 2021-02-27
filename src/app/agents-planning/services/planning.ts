import { fetchJson } from "../../../data";

export interface PositionSupply {
    readonly positionId: string;
    readonly employeeId: string;
    readonly timeLine: TimeLine;
}

interface TimeLine {
    startTime: number;
    endTime: number;
}

interface Shift {
    name: string;
    timeLine: TimeLine;
}

export function isInRange(tl: TimeLine, start: number, end: number) {
    return tl.startTime < end && tl.endTime > start;
}

export interface Track {
    groupingTrackId: string;
    id: string;
    trackId: string;
    employee: Employee;
    timeLine: TimeLine;
    trackGuid: string;
    positionId: string;
}

export interface Position {
    id: string;
    name: string;
    shorthand: string;
    defaultColor: string;
    children: Position[];
}

export interface DailyDemand {
    positionId: string;
    values: number[];
}

export interface Employee {
    shifts: Shift[];
    id: string;
    firstName: string;
    lastName: string;
}

export function fullName(e: Employee) {
    if (!e || !e.firstName || !e.lastName) {
        return null;
    }

    return e.firstName + " " + e.lastName;
}

export function fetchSupply(): Promise<PositionSupply[]> {
    return fetchJson("/planning/position-supply").then((e) => e.json());
}

export function fetchDemands(): Promise<DailyDemand[]> {
    return fetchJson("/planning/demands").then((e) => e.json());
}

export function fetchEmployees(): Promise<Employee[]> {
    return fetchJson("/planning/employees").then((e) => e.json());
}

export function fetchPositions(): Promise<Position[]> {
    return fetchJson("/planning/positions").then((e) => e.json());
}
