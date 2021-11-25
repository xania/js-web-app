import tpl from "@xania/glow.js";
import { List } from "@xania/glow.js/components";
import If from "@xania/glow.js/components/if";
import { Store } from "@xania/mutabl.js";
import { Expression } from "@xania/mutabl.js/lib/observable.js";
import "./style.scss";

export const timeUnit = 15;

export const hourColumns: number[] = new Array(24);
for (let h = 0; h < hourColumns.length; h++) {
  hourColumns[h] = h;
}

export const minuteColumns = getMinuteCells(timeUnit);

export interface TimeTableData<T> {
  identifier: string;
  label: string;
  children?: TimeTableData<T>[];
  values(hour: number, minute: number): T;
  bgColor?(value: T);
}

interface TimeTableProps<T> {
  cellContentTemplate(cell: T, row: TimeTableData<T>): any;
  rows: TimeTableData<T>[];
  label: string;
}

interface TimeTableRow<T> {
  data: TimeTableData<T>;
  depth: number;
  isLeaf: boolean;
  visible: Expression<boolean>;
  parent?: TimeTableRow<T>;
}

export default function TimeTable<T>(props: TimeTableProps<T>) {
  const { cellContentTemplate } = props;
  const collapsed = new Store<TimeTableRow<T>[]>([]);
  const rows = flatten(props.rows, collapsed);
  const selection = new Store<TimeSelection>(null);
  return (
    <div class="rom-time-table-container">
      {/* <div class="rom-time-table__loader" If="isLoading">
                <div class="rom-time-table__loader__content"></div>
            </div> */}
      <div
        If="timeUnit$ | async as timeUnit"
        class="rom-time-table"
        click={timeTableClick}
        ngClass="{'rom-time-table--loading': isLoading}"
      >
        <div class="rom-time-table-column">
          <div class="rom-time-table-position__header">
            <span class="rom-time-table-position__content">
              {props.label} ({rows.length})
            </span>
            <TimeUnits />
          </div>
          <List source={rows}>
            {(row: TimeTableRow<T>) => (
              <If condition={row.visible}>
                <If condition={row.depth === 0}>
                  <div class="rom-time-table-row--separator"></div>
                </If>
                <div
                  class="rom-time-table-position"
                  style_display="row.visible ? null : 'none'"
                  data-identifier={row.data.identifier}
                >
                  <span
                    class="rom-time-table-position__content"
                    style={"margin-left: " + (+row.depth * 18 + 24) + "px"}
                  >
                    <If condition={!row.isLeaf}>
                      <i
                        class="material-icons"
                        style="margin: auto auto auto -24px;"
                      >
                        {collapsed.lift((l) =>
                          l.includes(row)
                            ? "keyboard_arrow_right"
                            : "keyboard_arrow_down"
                        )}
                      </i>
                    </If>
                    {row.data.label}
                  </span>
                </div>
              </If>
            )}
          </List>
          <div class="rom-time-table-row--separator"></div>
        </div>
        <List source={hourColumns}>
          {(hour) => (
            <div class="rom-time-table-column">
              <div class="rom-time-table-column__hour">
                {prependZeros(hour)}
              </div>
              <div class="rom-time-table-column__minutes">
                <List source={minuteColumns}>
                  {(min) => (
                    <div>
                      <div class="rom-time-table-column__minutes__content">
                        {min ? prependZeros(min) : null}
                      </div>
                    </div>
                  )}
                </List>
              </div>
              <List source={rows}>
                {(row) => <Row hour={hour} row={row} />}
              </List>
              <div class="rom-time-table-row--separator"></div>
            </div>
          )}
        </List>
        {/* </div> */}
      </div>
    </div>
  );

  function timeTableClick(evt: MouseEvent) {
    const { target } = evt;
    if (isTag(target)) {
      const cell: HTMLElement = target.closest(".rom-time-table-cell");
      if (cell) {
        const { hour, identifier } = cell.parentElement.dataset;
        const { minute } = cell.dataset;
        const minuteOffset = +hour * 60 + +minute;
        selectCell(identifier, minuteOffset);
        return;
      }
      const rowHeader: HTMLElement = target.closest(".rom-time-table-position");
      if (rowHeader) {
        const { identifier } = rowHeader.dataset;
        const row = rows.find((n) => n.data.identifier === identifier);
        if (row) {
          collapsed.update((l) => {
            const idx = l.indexOf(row);
            if (idx >= 0) {
              l.splice(idx, 1);
            } else {
              l.push(row);
            }
          });

          const stack: TimeTableData<T>[] = [row.data];
          while (stack.length) {
            const curr = stack.pop();
            // const { childrenIdentifiers } = curr;
            // if (childrenIdentifiers) {
            //     const childVisible =
            //         curr.visible && curr.mode !== "collapsed";
            //     for (const childIdentifier of childrenIdentifiers) {
            //         const child = findRow(dataRows, childIdentifier);
            //         child.visible = childVisible;
            //         stack.push(child);
            //     }
            // }
          }
        }
      }
      const row: HTMLElement = target.closest(".rom-time-table-row");
      if (row) {
        const { hour, identifier } = row.dataset;

        const { offsetX } = evt;
        const columnIndex =
          Math.floor((+hour * 60) / timeUnit) + Math.floor(offsetX / 40);

        const minuteOffset = columnIndex * timeUnit;
        selectCell(identifier, minuteOffset);
      }
    }

    function isTag(target: any): target is HTMLElement {
      if (!target) {
        return false;
      }
      const element = target as HTMLElement;

      const { classList } = element;
      return classList && !!classList.contains;
    }

    function selectCell(rowIdentifier: string, minuteOffset: number) {
      const sel: TimeSelection = selection.peek((e) => e);
      const targetSelection: TimeSelection = {
        rowIdentifier,
        fromTime: {
          minuteOffset,
        },
        toTime: {
          minuteOffset: minuteOffset + timeUnit,
        },
      };

      if (!sel || sel.rowIdentifier !== rowIdentifier) {
        selection.update(targetSelection);
      } else {
        const { fromTime, toTime } = sel;

        if (
          isTimeRangeOverlapping(
            minuteOffset,
            minuteOffset + timeUnit,
            fromTime.minuteOffset,
            toTime.minuteOffset
          )
        ) {
          selection.update(null);
        } else {
          selection.update({
            rowIdentifier,
            fromTime: {
              minuteOffset: Math.min(+fromTime.minuteOffset, minuteOffset),
            },
            toTime: {
              minuteOffset: Math.max(
                +toTime.minuteOffset,
                minuteOffset + timeUnit
              ),
            },
          });
        }
      }
    }
  }

  interface RowProps {
    row: TimeTableRow<T>;
    hour: number;
  }
  function Row(props: RowProps) {
    const { row, hour } = props;
    const hv = hasValues(row, hour);
    return (
      <If condition={row.visible}>
        <If condition={row.depth === 0}>
          <div class="rom-time-table-row--separator"></div>
        </If>
        <div
          data-hour={hour}
          data-identifier={row.data.identifier}
          // style={visible.lift((b) => b && "display: none")}
          class={["rom-time-table-row"]}
        >
          <If
            condition={isColumnSelected(row.data, hour).lift((cs) => cs || hv)}
          >
            <List source={minuteColumns}>
              {(minute) => <Cell {...props} minute={minute} />}
            </List>
          </If>
        </div>
      </If>
      //     <ng-container
      //     If="
      //         row.visible &&
      //         ((isColumnSelected
      //             | apply: selection:row.identifier:hour) ||
      //             (hasValues | apply: row[hour]:minuteColumns))
      //     "
      // >
      // </ng-container>
    );
  }

  function isColumnSelected(row: TimeTableData<T>, hour: number) {
    const expr = selection.lift((sel) => {
      if (!sel) {
        return false;
      }
      if (row.identifier !== sel.rowIdentifier) {
        return false;
      }

      const { fromTime, toTime } = sel;
      const timeOffset = hour * 60;

      return isTimeRangeOverlapping(
        timeOffset,
        timeOffset + 60,
        fromTime.minuteOffset,
        toTime.minuteOffset
      );
    });

    return expr;
  }

  function isCellSelected(
    row: TimeTableRow<T>,
    hour: number,
    minute: number,
    sel: TimeSelection
  ) {
    if (!sel) {
      return null;
    }

    return (
      row.data.identifier == sel.rowIdentifier &&
      isTimeInSelection({ minuteOffset: hour * 60 + minute }, sel)
    );
  }

  function hasValues(row: TimeTableRow<T>, hour: number): boolean {
    for (const m of minuteColumns) {
      if (row.data.values(hour, m)) {
        return true;
      }
    }
    return false;
  }

  interface CellProps {
    row: TimeTableRow<T>;
    hour: number;
    minute: number;
  }
  function Cell(props: CellProps) {
    const { row, hour, minute } = props;
    const isSelected = selection.lift((sel) =>
      isCellSelected(row, hour, minute, sel)
    );
    const cell = row.data.values(hour, minute);
    return (
      <div
        class={[
          "rom-time-table-cell",
          isSelected.lift((b) => b && "rom-time-table-cell--selected"),
        ]}
        style={isSelected.lift((b) => {
          const bgColor = row.data.bgColor && row.data.bgColor(cell);
          if (!bgColor) {
            return null;
          }
          if (b) {
            return "color: white";
          }
          return "background-color: " + bgColor;
        })}
        data-minute={minute}
      >
        <a class="rom-time-table-cell__content">
          {cellContentTemplate(cell, row.data)}
        </a>
      </div>
    );
  }
}

function getMinuteCells(ptu: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < 60; i += ptu) {
    result.push(i);
  }
  return result;
}

function prependZeros(value) {
  return ("00" + value).slice(-2);
}

function TimeUnits() {
  return <span></span>;
}

interface Time {
  minuteOffset: number;
}

interface TimeSelection {
  rowIdentifier: string;
  fromTime: Time;
  toTime: Time;
}

// function isColumnSelected(
//     selection: TimeSelection,
//     rowIdentifier: string,
//     hour: number
// ) {
//     if (!selection) {
//         return false;
//     }
//     if (rowIdentifier !== selection.rowIdentifier) {
//         return false;
//     }

//     const { fromTime, toTime } = selection;
//     const timeOffset = hour * 60;

//     return isTimeRangeOverlapping(
//         timeOffset,
//         timeOffset + 60,
//         fromTime.minuteOffset,
//         toTime.minuteOffset
//     );
// };

function isTimeRangeOverlapping(
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  return Math.max(x1, x2) < Math.min(y1, y2);
}

function isTimeInSelection(t1: Time, s1: TimeSelection) {
  const { minuteOffset } = t1;
  if (minuteOffset < s1.fromTime.minuteOffset) {
    return false;
  }
  if (minuteOffset >= s1.toTime.minuteOffset) {
    return false;
  }
  return true;
}

function flatten<T>(
  rows: TimeTableData<T>[],
  collapsed: Store<TimeTableRow<T>[]>
) {
  const stack: [number, TimeTableData<T>, TimeTableRow<T>?][] = reverse(
    rows
  ).map((r) => [0, r, null]);
  const result: TimeTableRow<T>[] = [];

  while (stack.length > 0) {
    const [depth, curr, parent] = stack.pop();
    const { children } = curr;
    const row: TimeTableRow<T> = {
      depth,
      isLeaf: !children || children.length == 0,
      data: curr,
      parent,
      visible: collapsed.lift((col) => {
        let p = parent;
        while (p) {
          if (col.includes(p)) {
            return false;
          }
          p = p.parent;
        }
        return true;
      }),
    };
    result.push(row);
    if (children)
      for (const child of reverse(children)) {
        stack.push([depth + 1, child, row]);
      }
  }

  return result;
}

function reverse<T>(arr: T[]): T[] {
  const result: T[] = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }

  return result;
}
