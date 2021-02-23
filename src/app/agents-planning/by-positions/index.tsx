import tpl from "glow.js";
import If from "glow.js/components/if";
import { Fragment } from "glow.js/lib/fragment";
import TimeTable, {
    TimeTableData,
    timeUnit,
} from "../../../components/time-table";
import { fetchJson } from "../../../data";
import { DailyDemand, PlanCell, Position } from "../models";

interface PositionSupply {
    readonly positionId: string;
    readonly employeeId: string;
    readonly startTime: number;
    readonly endTime: number;
}

interface PlanningProps {
    positions: Position[];
}

export default async function PlanningPerPosition(props: PlanningProps) {
    return (
        <Fragment>
            <header style="display: flex; gap: 12px;">
                Planning Per Position
            </header>
            <main>
                <TimeTable
                    label="Position"
                    rows={await getRows(props.positions)}
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

async function getRows(positions: Position[]) {
    const supply: PositionSupply[] = await fetchJson(
        "/planning/position-supply"
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
                const start = hour * 60 + minute;
                const end = start + timeUnit;

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

function countSupplyInRange(
    positionSupply: PositionSupply[],
    start: number,
    end: number
) {
    let count = 0;

    for (const pl of positionSupply) {
        if (pl.startTime >= end || pl.endTime <= start) {
            continue;
        }
        count++;
    }

    return count;
}

function countDemandInRange(
    demand: DailyDemand,
    startTime: number,
    endTime: number
) {
    let result = 0;
    if (demand) {
        const startIndex = timeToIndex(startTime);
        const endIndex = timeToIndex(endTime);
        for (let i = startIndex; i < endIndex; i++) {
            const x = demand.values[(i * timeUnit) / 5];
            if (x > result) {
                result = x;
            }
        }
    }
    return result;
}

function timeToIndex(t: number) {
    const totalMinutes = t;
    return Math.floor(totalMinutes / timeUnit);
}
