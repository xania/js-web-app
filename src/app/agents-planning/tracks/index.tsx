import tpl from "glow.js";
import { Fragment } from "glow.js/lib/fragment";
import { Component } from "mvc.js/router";
import TimeTable from "../../../components/time-table";

export function TracksPlanning(): Component {
    return {
        view() {
            return (
                <Fragment>
                    <header style="display: flex; gap: 12px;">
                        Planning Per Track
                    </header>
                    <main>
                        <TimeTable
                            label="Agent"
                            rows={[]}
                            cellContentTemplate={(cell: PlanCell) => (
                                <div>test de test</div>
                            )}
                        />
                    </main>
                </Fragment>
            );
        },
    };
}

function getRows(): Track {
    return [];
}

interface Track {}

interface PlanCell {}
