import tpl from "glow.js";
import { Fragment } from "glow.js/lib/fragment";
import TimeTable, {
    TimeTableData,
    timeUnit,
} from "../../../components/time-table";
import { fetchJson } from "../../../data";
import { DailyDemand, Position } from "../models";

interface DemandCell {
    demand: number;
    implicit?: number;
}

export default async function DemandPlanning() {
    return (
        <Fragment>
            <header style="display: flex; gap: 12px;">
                <input type="date" />
                <button
                    class="mdc-button mdc-button--raised"
                    style="--mdc-theme-primary: blue"
                >
                    Set demand
                </button>
                <button
                    class="mdc-button mdc-button--raised mdc-button--danger"
                    style="--mdc-theme-primary: red"
                >
                    <span class="mdc-button__ripple"></span>
                    <i
                        class="material-icons mdc-button__icon"
                        aria-hidden="true"
                    >
                        bookmark
                    </i>
                    <span class="mdc-button__label">Upload file</span>
                </button>
            </header>
            <main>
                <TimeTable
                    rows={await getRows()}
                    cellContentTemplate={(cell) => {
                        return (
                            <Fragment>
                                {cell && cell.demand}
                                <span class="rom-datatable-cell__content__delta">
                                    {formatDelta(cell)}
                                </span>
                            </Fragment>
                        );
                    }}
                />
            </main>
        </Fragment>
    );
}

async function getRows() {
    const demands: DailyDemand[] = await fetchJson(
        "/planning/demands"
    ).then((e) => e.json());
    const positions: Position[] = await fetchJson(
        "/planning/positions"
    ).then((e) => e.json());
    const rows: TimeTableData<DemandCell>[] = [];
    for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        rows.push(toRow(pos));
    }

    return rows;

    function toRow(pos: Position): TimeTableData<DemandCell> {
        const demand = demands.find((e) => e.positionId === pos.id);
        return {
            identifier: pos.id,
            label: pos.name,
            children: pos.children.map(toRow),
            values(hour: number, minute: number) {
                if (!demand) {
                    return null;
                }
                const idx = Math.floor((hour * 60 + minute) / 5);
                const value = demand.values[idx] || 0;
                if (!value) {
                    return null;
                }
                return {
                    demand: value,
                    implicit: value - 1,
                };
            },
            bgColor(cell) {
                if (!cell) {
                    return null;
                }
                const { demand, implicit } = cell;
                if (demand) {
                    if (implicit) {
                        const delta = demand - implicit;
                        if (delta) {
                            return `rgba(255,0,0,${0.03 * Math.abs(delta)})`;
                        } else {
                            return "rgba(0,255,0,0.2)";
                        }
                    }
                    return "rgba(0,200,222,0.1)";
                } else if (implicit) {
                    return `rgba(255,0,0,${0.03 * Math.abs(implicit)})`;
                }

                return null;
            },
        };
    }
}

function formatDelta(cell: DemandCell) {
    if (!cell) {
        return null;
    }

    const { demand, implicit } = cell;
    if (!demand || !implicit) {
        return null;
    }

    const delta = (cell.demand || 0) - (cell.implicit || 0);
    return delta ? `(${delta})` : null;
}
