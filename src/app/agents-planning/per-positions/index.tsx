import tpl from "glow.js";
import If from "glow.js/components/if";
import { Fragment } from "glow.js/lib/fragment";
import TimeTable, {
    TimeTableData,
    timeUnit,
} from "../../../components/time-table";
import { fetchJson } from "../../../data";
import { DailyDemand, Position } from "../models";

interface TimeTableCell {
    hour: number;
    minute: number;
}

interface PlanCell {
    supply: number;
    demand: number;
}

interface PositionSupply {
    readonly positionId: string;
    readonly employeeId: string;
    readonly start: TimeTableCell;
    readonly end: TimeTableCell;
}

export default async function PlanningPerPosition() {
    return (
        <Fragment>
            <header style="display: flex; gap: 12px;">
                Planning Per Position
            </header>
            <main>
                <TimeTable
                    rows={await getRows()}
                    cellContentTemplate={(cell) => {
                        if (!cell) {
                            return null;
                        }
                        return (
                            <Fragment>
                                <span>D: {cell.demand}</span>
                                <If condition={cell.supply !== cell.demand}>
                                    <span class="rom-time-table-cell__delta">
                                        {cell.supply - cell.demand}
                                    </span>
                                </If>
                            </Fragment>
                        );
                    }}
                />
            </main>
        </Fragment>
    );
}

async function getRows() {
    const supply: PositionSupply[] = await fetchJson(
        "/planning/position-supply"
    ).then((e) => e.json());
    const positions: Position[] = await fetchJson(
        "/planning/positions"
    ).then((e) => e.json());
    const demands: DailyDemand[] = await fetchJson(
        "/planning/demands"
    ).then((e) => e.json());
    const rows: TimeTableData<PlanCell>[] = [];

    for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        const row = toRow(pos);
        if (row) {
            rows.push(row);
        }
    }

    return rows;

    function toRow(pos: Position): TimeTableData<PlanCell> {
        const positionSupply = supply.filter((e) => e.positionId === pos.id);
        const positionDemand = demands.find((e) => e.positionId === pos.id);
        const children = pos.children.map(toRow).filter((e) => e != null);
        if (children.length == 0 && positionSupply.length == 0) {
            return null;
        }

        return {
            identifier: pos.id,
            label: pos.name,
            children,
            values(hour: number, minute: number) {
                const start = { hour, minute };
                const end = {
                    hour,
                    minute: minute + timeUnit,
                };

                const cell: PlanCell = {
                    supply: countSupplyInRange(positionSupply, start, end),
                    demand: countDemandInRange(positionDemand, start, end),
                };

                if (!!cell.demand || !!cell.supply) {
                    return cell;
                }

                return null;
            },
            bgColor(cell) {
                if (!cell) {
                    return null;
                }
                const { supply } = cell;
                if (supply) {
                    return `rgba(255,0,0,${0.03 * Math.abs(supply)})`;
                }

                return null;
            },
        };
    }
}

function compareTime(x: TimeTableCell, y: TimeTableCell) {
    if (x.hour == y.hour) {
        if (x.minute == y.minute) return 0;
        return x.minute > y.minute ? 1 : -1;
    }
    return x.hour > y.hour ? 1 : -1;
}

function countSupplyInRange(
    positionSupply: PositionSupply[],
    start: TimeTableCell,
    end: TimeTableCell
) {
    let count = 0;

    for (const pl of positionSupply) {
        if (compareTime(pl.start, end) >= 0) {
            continue;
        }
        if (compareTime(pl.end, start) <= 0) {
            continue;
        }
        count++;
    }

    return count;
}

function countDemandInRange(
    demand: DailyDemand,
    start: TimeTableCell,
    end: TimeTableCell
) {
    let result = 0;
    if (demand) {
        const startIndex = timeToIndex(start);
        const endIndex = timeToIndex(end);
        for (let i = startIndex; i < endIndex; i++) {
            const x = demand.values[(i * timeUnit) / 5];
            if (x > result) {
                result = x;
            }
        }
    }
    return result;
}

function timeToIndex(t: TimeTableCell) {
    const totalMinutes = t.hour * 60 + t.minute;
    return Math.floor(totalMinutes / timeUnit);
}
