import tpl from "glow.js";
import { Fragment } from "glow.js/lib/fragment";
import { Component } from "mvc.js/router";
import TimeTable, {
    TimeTableData,
    timeUnit,
} from "../../../components/time-table";
import { fetchJson } from "../../../data";
import { Position } from "../models";

export function TracksPlanning(): Component {
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
                            rows={await getRows()}
                            cellContentTemplate={(cell: TrackCell) => (
                                <span>{cell && cell.shorthand}</span>
                            )}
                        />
                    </main>
                </Fragment>
            );
        },
    };
}

async function getRows(): Promise<TimeTableData<TrackCell>[]> {
    const tracks: Track[] = await fetchJson("./planning/tracks").then((e) =>
        e.json()
    );
    const positions: Position[] = await fetchJson(
        "/planning/positions"
    ).then((e) => e.json());

    const positionMap: { [id: string]: Position } = {};
    for (const pos of positions) {
        positionMap[pos.id] = pos;
    }

    const rows: TimeTableData<TrackCell>[] = [];

    for (let i = 0; i < tracks.length; i++) {
        const row = toRow(tracks[i]);
        if (row) {
            rows.push(row);
        }
    }

    return rows;

    function toRow(track: Track): TimeTableData<TrackCell> {
        const children: TimeTableData<TrackCell>[] = [];

        for (const trackId in track.subTracks) {
            const subTracks = track.subTracks[trackId];
            children.push({
                identifier: trackId,
                label: trackId,
                values(h: number, m: number): TrackCell {
                    const start = h * 60 + m;
                    const end = start + timeUnit;

                    for (const sub of subTracks) {
                        if (sub.startTime >= end || sub.endTime <= start) {
                            continue;
                        }
                        const pos = positionMap[sub.positionId];
                        if (pos) {
                            return {
                                shorthand: pos.shorthand,
                            };
                        }
                    }
                    return null;
                },
            });
        }

        return {
            identifier: track.id,
            bgColor() {
                return null;
            },
            children,
            label: track.id,
            values(h, m): TrackCell {
                return null;
            },
        };
    }

    function trackToRow(sub: SubTrack): TimeTableData<TrackCell> {
        return {
            identifier: sub.id,
            label: sub.employee.firstName || sub.trackId,
            values() {
                return null;
            },
        };
    }
}

interface SubTrack {
    id: string;
    trackId: string;
    employee: {
        firstName: string;
        lastName: string;
    };
    startTime: number;
    endTime: number;
    trackGuid: string;
    positionId: string;
}
interface Track {
    id: string;
    subTracks: { [trackId: string]: SubTrack[] };
}

interface TrackCell {
    shorthand: string;
}
