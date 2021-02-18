import tpl from "glow.js";
import { RouterOutlet } from "mvc.js/outlet";
import { Component, ViewContext } from "mvc.js/router";
import { RouterPage } from "..";
import TabBar from "../../components/tab-bar";
import DemandPlanning from "./demands";
import PlanningByPosition from "./by-positions";
import { TracksPlanning } from "./tracks";
import { PlanningByAgents } from "./by-agents";
import * as Rx from "rxjs";
import { Store } from "../../../mutabl.js";

const nav = [
    {
        path: ["demands"],
        component: () => <DemandPlanning />,
    },
    {
        path: ["per-position"],
        component: () => <PlanningByPosition />,
    },
    {
        path: ["tracks"],
        component: () => <TracksPlanning />,
    },
    {
        path: [],
        component: () => <PlanningByAgents />,
    },
];

export function AgentsPlanning(): Component {
    return {
        view(context: ViewContext) {
            const currentRoute = new Store<string[]>([]);
            return (
                <RouterPage>
                    <div class="router-page__content">
                        <header style="max-width: 900px;">
                            <TabBar selected={currentRoute} />
                        </header>
                        <RouterOutlet
                            onResolved={onResolved}
                            router={context.childRouter(nav)}
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
