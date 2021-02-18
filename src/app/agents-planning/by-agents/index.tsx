import tpl from "glow.js";
import { Fragment } from "glow.js/lib/fragment";
import { Component } from "mvc.js/router";
import TimeTable from "../../../components/time-table";

export function PlanningByAgents(): Component {
    return {
        view() {
            return (
                <Fragment>
                    <header>Planning By Agents</header>
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
