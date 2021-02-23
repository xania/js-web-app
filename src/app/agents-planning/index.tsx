import tpl from "glow.js";
import { RouterOutlet } from "mvc.js/outlet";
import { Component, ViewContext } from "mvc.js/router";
import { RouterPage } from "..";
import TabBar from "../../components/tab-bar";
import DemandPlanning from "./demands";
import PlanningByPosition from "./by-positions";
import { TracksPlanning } from "./tracks";
import { PlanningByAgents } from "./by-agents";
import { Store } from "../../../mutabl.js";
import { Position } from "./models";
import { fetchJson } from "../../data";

const nav = (positions: Position[]) => [
    {
        path: ["demands"],
        component: () => <DemandPlanning positions={positions} />,
    },
    {
        path: ["per-position"],
        component: () => <PlanningByPosition positions={positions} />,
    },
    {
        path: ["tracks"],
        component: () => <TracksPlanning positions={positions} />,
    },
    {
        path: [],
        component: () => <PlanningByAgents />,
    },
];

export function AgentsPlanning(): Component {
    return {
        async view(context: ViewContext) {
            const positions: Position[] = await fetchJson(
                "/planning/positions"
            ).then((e) => e.json());

            const currentRoute = new Store<string[]>([]);
            return (
                <RouterPage>
                    <div class="router-page__content">
                        <header style="max-width: 900px;">
                            <TabBar selected={currentRoute} />
                        </header>
                        <RouterOutlet
                            onResolved={onResolved}
                            router={context.childRouter(nav(positions))}
                        />
                    </div>
                </RouterPage>
            );

            function onResolved(paths: string[][]) {
                const first = paths[0];
                if (first) {
                    currentRoute.next(first);
                }
            }
        },
    };
}
