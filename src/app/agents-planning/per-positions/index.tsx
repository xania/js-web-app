import tpl from "glow.js";
import { Fragment } from "glow.js/lib/fragment";
import TimeTable, { TimeTableData } from "../../../components/time-table";
import { fetchJson } from "../../../data";
import { Position } from "../models/Position";

interface PlanCell {
    value: string;
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
                        return <Fragment>{cell && cell.value}</Fragment>;
                    }}
                />
            </main>
        </Fragment>
    );
}

async function getRows() {
    const positions: Position[] = await fetchJson(
        "/planning/positions"
    ).then((e) => e.json());
    const rows: TimeTableData<PlanCell>[] = [];
    for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        rows.push(toRow(pos));
    }

    return rows;

    function toRow(pos: Position): TimeTableData<PlanCell> {
        return {
            identifier: pos.id,
            label: pos.name,
            children: pos.children.map(toRow),
            values(hour: number, minute: number) {
                const value = Math.random();
                if (value < 0.75) {
                    return null;
                }
                return {
                    value: hour + ":" + minute,
                };
            },
            bgColor(cell) {
                if (!cell) {
                    return null;
                }
                return "rgba(0,255,0,0.2)";
            },
        };
    }
}
