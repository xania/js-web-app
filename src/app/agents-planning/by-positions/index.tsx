import jsx, { Fragment, If } from "@xania/glow.js";
import TimeTable, {
  TimeTableData,
  timeUnit,
} from "../../../components/time-table";
import {
  DailyDemand,
  fetchDemands,
  fetchSupply,
  isInRange,
  Position,
  PositionSupply,
} from "../services/planning";

interface PlanningProps {
  positions: Promise<Position[]>;
}

export default async function PlanningPerPosition(props: PlanningProps) {
  return (
    <Fragment>
      <header style="display: flex; gap: 12px;">Planning Per Position</header>
      <main>
        <TimeTable
          label="Position"
          rows={await getRows(await props.positions)}
          cellContentTemplate={(cell) => {
            if (!cell) {
              return null;
            }
            return (
              <Fragment>
                <span>D: {cell.demand}</span>
                <If condition={cell.supply !== cell.demand}>
                  <span class="rom-time-table-cell__delta">
                    {cell.supply - cell.demand}
                  </span>
                </If>
              </Fragment>
            );
          }}
        />
      </main>
    </Fragment>
  );
}

async function getRows(positions: Position[]) {
  const supply = await fetchSupply();
  const demands = await fetchDemands();
  const rows: TimeTableData<PlanCell>[] = [];

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    const row = toRow(pos);
    if (row) {
      rows.push(row);
    }
  }

  return rows;

  function toRow(pos: Position): TimeTableData<PlanCell> {
    const positionSupply = supply.filter((e) => e.positionId === pos.id);
    const positionDemand = demands.find((e) => e.positionId === pos.id);
    const children = pos.children.map(toRow).filter((e) => e != null);
    if (children.length == 0 && positionSupply.length == 0) {
      return null;
    }

    return {
      identifier: pos.id,
      label: pos.name,
      children,
      values(hour: number, minute: number) {
        const start = hour * 60 + minute;
        const end = start + timeUnit;

        const cell: PlanCell = {
          supply: countSupplyInRange(positionSupply, start, end),
          demand: countDemandInRange(positionDemand, start, end),
        };

        if (!!cell.demand || !!cell.supply) {
          return cell;
        }

        return null;
      },
      bgColor(cell) {
        if (!cell) {
          return null;
        }
        const { supply } = cell;
        if (supply) {
          return `rgba(255,0,0,${0.03 * Math.abs(supply)})`;
        }

        return null;
      },
    };
  }
}

export function countSupplyInRange(
  positionSupply: PositionSupply[],
  start: number,
  end: number
) {
  let count = 0;

  for (const pl of positionSupply) {
    if (!isInRange(pl.timeLine, start, end)) continue;
    count++;
  }

  return count;
}

export function countDemandInRange(
  demand: DailyDemand,
  startTime: number,
  endTime: number
) {
  let result = 0;
  if (demand) {
    const startIndex = timeToIndex(startTime);
    const endIndex = timeToIndex(endTime);
    for (let i = startIndex; i < endIndex; i++) {
      const x = demand.values[(i * timeUnit) / 5];
      if (x > result) {
        result = x;
      }
    }
  }
  return result;
}

function timeToIndex(t: number) {
  const totalMinutes = t;
  return Math.floor(totalMinutes / timeUnit);
}

export interface PlanCell {
  supply: number;
  demand: number;
}
