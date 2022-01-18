import jsx, { If, Fragment } from "@xania/glow.js";
import TimeTable, {
  TimeTableData,
  timeUnit,
} from "../../../components/time-table";
import groupBy from "../../../core/group-by";
import {
  Employee,
  fetchSupply,
  fullName,
  isInRange,
  Position,
} from "../services/planning";

interface PlanningProps {
  positions: Promise<Position[]>;
  employees: Promise<Employee[]>;
}

interface EmployeeCell {
  delta: number;
  position: string;
  supply: number;
  hasShift: boolean;
}

export default async function PlanningByAgents(props: PlanningProps) {
  return (
    <Fragment>
      <header style="display: flex; gap: 12px;">Planning By Agents</header>
      <main>
        <TimeTable
          label="Position"
          rows={await getRows(await props.employees, await props.positions)}
          cellContentTemplate={cellTemplate}
        />
      </main>
    </Fragment>
  );

  function cellTemplate(cell: EmployeeCell) {
    if (!cell) {
      return null;
    }

    return (
      <Fragment>
        <div class="tc" class_d="!c?.available" ngIf="item.children">
          <span ngIf="!row.toggled">{cell.supply || null}</span>
          <div class="b" ngIf="row.toggled"></div>
        </div>
        <div
          class="tc"
          class_d="!c?.available"
          class_absent="c?.absent"
          class_overstay="maxStandingTimeEnabled && c?.overstay == 1"
          class_overstay_position="maxPositionStandingTimeEnabled && c?.overstay == 2"
          class_substitute="c?.substituteMode"
          class_target="c?.substituteMode === 1"
          class_no_show="c?.status == 'NoShow'"
          style_background="c?.highlight"
          ngIf="!item.children"
        >
          <div
            class="pos"
            ngIf="c?.position"
            matTooltip="hiddenPlanIndicatorEnabled && !!getTooltip(item, i)? getTooltip(item, i): c?.tooltip"
          >
            {/* <span
                            class="material-icons hidden-plan"
                            ngIf="hiddenPlanIndicatorEnabled && !!getTooltip(item, i)"
                        >
                            visibility_off
                        </span> */}
            <If condition={!!cell.position}>
              <span>{cell.position}</span>
            </If>
            <If condition={cell.delta > 0}>
              <span class={["delta", cell.delta && "overflow"]}>
                {cell.delta}
              </span>
            </If>
            {/* <span
                            class="remark"
                            matTooltip="c?.remark"
                            ngIf="c?.remark"
                        >
                            !
                        </span> */}
          </div>
        </div>
      </Fragment>
    );
  }
}

async function getRows(employees: Employee[], positions: Position[]) {
  const supply = await fetchSupply();

  const rows: TimeTableData<EmployeeCell>[] = [];
  const groups = groupBy(
    supply,
    (e) => e.employeeId,
    (k, s) => ({
      key: k,
      employee: employees.find((e) => e.id == k),
      items: [s],
    })
  );
  groups.sort((x, y) =>
    employeeName(x.employee).localeCompare(employeeName(y.employee))
  );

  for (const group of groups) {
    const empl = group.employee;
    if (empl) {
      const employeeSupply = supply.filter(
        (e) => e.employeeId === empl.id && !!e.positionId
      );

      rows.push({
        identifier: group.key,
        label: fullName(empl),
        values(hour: number, minute: number) {
          const start = hour * 60 + minute;
          const end = start + timeUnit;

          const supply = employeeSupply.filter((e) =>
            isInRange(e.timeLine, start, end)
          );
          return {
            position: supply
              .map((e) => getShorthand(positions, e.positionId))
              .join(","),
            delta: 0,
            supply: 0,
            hasShift:
              empl.shifts.filter((e) => isInRange(e.timeLine, start, end))
                .length > 0,
          } as EmployeeCell;
        },
        bgColor(cell: EmployeeCell): string {
          if (cell.hasShift) {
            return "#FFFFFF90";
          } else {
            return "#66666649";
          }
        },
      });
    }
  }

  return rows;
}

function getShorthand(positions: Position[], positionId: string) {
  const stack = positions.slice(0);
  while (stack.length) {
    const p = stack.pop();
    if (p.id == positionId) {
      return p.shorthand;
    } else if (!!p.children) {
      for (const c of p.children) {
        stack.push(c);
      }
    }
  }
}

function employeeName(x: Employee) {
  return fullName(x) || "";
}
