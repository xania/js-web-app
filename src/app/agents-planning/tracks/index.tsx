import tpl from "glow.js";
import Css from "glow.js/components/css";
import If from "glow.js/components/if";
import { Fragment } from "glow.js/lib/fragment";
import { Component } from "mvc.js/router";
import TimeTable, {
    TimeTableData,
    timeUnit,
} from "../../../components/time-table";
import { fetchJson } from "../../../data";
import { Position } from "../models";
import "./style.scss";

interface PlanningProps {
    positions: Position[];
}

export function TracksPlanning(props: PlanningProps): Component {
    return {
        async view() {
            return (
                <Fragment>
                    <header style="display: flex; gap: 12px;">
                        Planning Per Track
                    </header>
                    <main>
                        <TimeTable
                            label="Agent"
                            rows={await getRows(props.positions)}
                            cellContentTemplate={trackCellTemplate}
                        />
                    </main>
                </Fragment>
            );
        },
    };

    function trackCellTemplate(
        cell: TrackCell | {},
        row: TimeTableData<TrackCell>
    ) {
        if (row.children) {
            return <Css value="grouping-track" />;
        }
        if (!cell || !("shorthand" in cell)) {
            return null;
        }

        const classList = [
            "tc",
            cell.shorthand && "d",
            cell.absent && "absent",
            cell.substituted && "substituted",
        ];
        return (
            <div
                class={classList}
                matTooltip="c?.tooltip"
                style={"background-color: " + cell.bgColor + "80"}
            >
                <div class="pos">
                    <span>{cell.shorthand}</span>
                    <span
                        class="delta"
                        ngIf="c.delta"
                        class_overflow="c.delta > 0"
                    >
                        0
                    </span>
                    <If condition={!!cell.remark}>
                        <span class="remark" matTooltip="c.remark">
                            !
                        </span>
                    </If>
                </div>
            </div>
        );
    }
}

async function getRows(
    positions: Position[]
): Promise<TimeTableData<TrackCell | {}>[]> {
    const tracks: Track[] = await fetchJson("./planning/tracks").then((e) =>
        e.json()
    );

    const positionMap: { [id: string]: Position } = {};
    for (const pos of positions) {
        positionMap[pos.id] = pos;
    }

    const rows: TimeTableData<TrackCell | {}>[] = [];

    const trackGroups: Group<Track>[] = groupBy(
        tracks,
        (e) => e.groupingTrackId
    );

    for (const trackGroup of trackGroups) {
        const row = toRow(trackGroup);
        if (row) {
            rows.push(row);
        }
    }

    return rows;

    function toRow(trackGroup: Group<Track>): TimeTableData<TrackCell | {}> {
        const children: TimeTableData<TrackCell>[] = [];

        const subTracks = groupBy(
            trackGroup.value,
            (e) => fullName(e.employee) || e.trackId
        );

        for (const subTrack of subTracks) {
            children.push({
                identifier: subTrack.key,
                label: subTrack.key,
                values(h: number, m: number): TrackCell {
                    const start = h * 60 + m;
                    const end = start + timeUnit;

                    for (const sub of subTrack.value) {
                        if (sub.startTime >= end || sub.endTime <= start) {
                            continue;
                        }
                        const pos = positionMap[sub.positionId];
                        if (pos) {
                            return {
                                shorthand: pos.shorthand,
                                absent: false,
                                bgColor: pos.defaultColor,
                                substituted: false,
                            };
                        }
                    }
                    return null;
                },
            });
        }

        return {
            identifier: trackGroup.key,
            bgColor() {
                return null;
            },
            children,
            label: trackGroup.key,
            values() {
                return {};
            },
        };
    }
}

interface Employee {
    firstName: string;
    lastName: string;
}

interface Track {
    groupingTrackId: string;
    id: string;
    trackId: string;
    employee: Employee;
    startTime: number;
    endTime: number;
    trackGuid: string;
    positionId: string;
}

interface TrackCell {
    bgColor: string;
    substituted: boolean;
    shorthand: string;
    absent: boolean;
    remark?: string;
}

type Group<T> = { key: string; value: T[] };
function groupBy<T>(arr: T[], selector: (item: T) => string): Group<T>[] {
    const groups: Group<T>[] = [];

    for (const item of arr) {
        const key = selector(item);
        const group = findGroup(key);
        if (group) {
            group.value.push(item);
        } else {
            groups.push({
                key,
                value: [item],
            });
        }
    }

    groups.sort((x, y) => x.key.localeCompare(y.key));
    return groups;

    function findGroup(key: string) {
        for (const group of groups) {
            if (group.key == key) {
                return group;
            }
        }
        return null;
    }
}

function fullName(e: Employee) {
    if (!e || !e.firstName || !e.lastName) {
        return null;
    }

    return e.firstName + " " + e.lastName;
}

function randomColor() {
    const hex = "0123456789ABCDEF";
    let result = "#";
    for (let i = 0; i < 6; i++) {
        result += randomChar(hex);
    }
    return result + "10";
}

function randomChar(hex: string) {
    const i = Math.floor(Math.random() * hex.length);
    return hex[i];
}
