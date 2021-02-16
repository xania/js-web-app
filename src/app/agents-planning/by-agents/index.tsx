import tpl from "glow.js";
import { Component } from "mvc.js/router";
import TimeTable from "../../../components/time-table";

export function PlanningByAgents(): Component {
    return {
        view() {
            return (
                <TimeTable
                    label="Agent"
                    rows={[]}
                    cellContentTemplate={(cell: PlanCell) => (
                        <div>test de test</div>
                    )}
                />
            );
        },
    };
}

function getRows(): Track {
    return [];
}

interface Track {}

interface PlanCell {}
