import jsx from "@xania/glow.js";
import { RouterOutlet } from "@xania/mvc.js/outlet";
import { RouterComponent, ViewContext } from "@xania/mvc.js/router";
import { RouterPage } from "..";
import TabBar from "../../components/tab-bar";
import PlanningByAgents from "./by-agents";
import TracksPlanning from "./tracks";
import PlanningByPosition from "./by-positions";
import DemandPlanning from "./demands";
import { Store } from "../../../mutabl.js";
import { fetchEmployees, fetchPositions } from "./services/planning";
import Spinner from "../../components/spinner";

function nav() {
  const employees = fetchEmployees();
  const positions = fetchPositions();

  return [
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
      component: () => (
        <PlanningByAgents employees={employees} positions={positions} />
      ),
    },
  ];
}

export function AgentsPlanning(): RouterComponent {
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
              router={context.childRouter(nav())}
              loader={<Spinner />}
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
