import tpl from "glow.js";
import { createListSource, List } from "glow.js/components";
import If from "glow.js/components/if";
import { Store } from "../../../mutabl.js";
import "./style.scss";
import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";

const timeUnit = 5;

export const hourColumns: number[] = new Array(24);
for (let h = 0; h < hourColumns.length; h++) {
    hourColumns[h] = h;
}

export const minuteColumns = getMinuteCells(timeUnit);

export interface TimeTableRow<T> {
    identifier: string;
    label: string;
    mode: "collapsed" | "expanded" | "leaf";
    visible: boolean;
    depth: number;
    value(hour: number, minute: number): T;
    bgColor(hour: number, minute: number);
}

interface TimeTableProps<T> {
    cellContentTemplate(
        data: TimeTableRow<T>,
        hour: number,
        minute: number
    ): any;
    rows: TimeTableRow<T>[];
}

export default function TimeTable<T>(props: TimeTableProps<T>) {
    const { cellContentTemplate, rows } = props;
    const selection = new Store<TimeSelection>();
    return (
        <div class="rom-time-table-container">
            {selection.subscribe(console.log)}
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
                            Position ({rows.length})
                        </span>
                        <TimeUnits />
                    </div>
                    <List source={rows}>
                        {(row: TimeTableRow<T>) => (
                            <div
                                class="rom-time-table-position"
                                For="let row of dataRows; trackBy: row?.identifier"
                                style_display="row.visible ? null : 'none'"
                                attr_data_identifier="row.identifier"
                            >
                                <If condition={row.visible}>
                                    <span
                                        class="rom-time-table-position__content"
                                        style={
                                            "margin-left: " +
                                            (+row.depth * 18 + 24) +
                                            "px"
                                        }
                                    >
                                        <If condition={row.mode !== "leaf"}>
                                            <i
                                                class="material-icons"
                                                style="margin: auto auto auto -24px;"
                                            >
                                                {row.mode === "expanded"
                                                    ? "keyboard_arrow_down"
                                                    : row.mode === "collapsed"
                                                    ? "keyboard_arrow_right"
                                                    : null}
                                            </i>
                                        </If>
                                        {row.label}
                                    </span>
                                </If>
                            </div>
                        )}
                    </List>
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
            if (target.classList.contains("rom-time-table-cell")) {
                const { hour, identifier } = target.parentElement.dataset;
                const { minute } = target.dataset;
                const minuteOffset = +hour * 60 + +minute;
                selectCell(identifier, minuteOffset);
            } else if (target.classList.contains("rom-time-table-position")) {
                const { identifier } = target.dataset;
                const row = rows.find((n) => n.identifier === identifier);
                if (row) {
                    if (row.mode === "collapsed") {
                        row.mode = "expanded";
                    } else if (row.mode === "expanded") {
                        row.mode = "collapsed";
                    }

                    const stack: TimeTableRow<T>[] = [row];
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
            } else if (target.classList.contains("rom-time-table-row")) {
                const { hour, identifier } = target.dataset;

                const { offsetX } = evt;
                const columnIndex =
                    Math.floor((+hour * 60) / timeUnit) +
                    Math.floor(offsetX / 40);

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
                            minuteOffset: Math.min(
                                +fromTime.minuteOffset,
                                minuteOffset
                            ),
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
        return (
            <div
                data-hour={hour}
                data-identifier={row.identifier}
                style={row.visible ? null : "display: none"}
                class={[
                    "rom-time-table-row",
                    row.visible ? null : "rom-time-table-row--hidden",
                ]}
            >
                <If
                    condition={isColumnSelected(row, hour).pipe(
                        Ro.startWith(false),
                        Ro.combineLatest(
                            hasValues(row, hour),
                            (hv, cs) => hv || cs
                        )
                    )}
                >
                    <List source={minuteColumns}>
                        {(minute) => <Cell {...props} minute={minute} />}
                    </List>
                </If>
            </div>
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

    function isColumnSelected(row: TimeTableRow<T>, hour: number) {
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

        return Rx.from(expr);
    }

    function isCellSelected(
        row: TimeTableRow<T>,
        hour: number,
        minute: number
    ) {
        return (sel: TimeSelection) =>
            row.identifier == sel.rowIdentifier &&
            isTimeInSelection({ minuteOffset: hour * 60 + minute }, sel);
    }

    function hasValues(
        row: TimeTableRow<T>,
        hour: number
    ): Rx.Observable<boolean> {
        // if (!column) {
        //     return false;
        // }
        for (const m of minuteColumns) {
            if (row.value(hour, m)) {
                return Rx.of(true);
            }
        }
        return Rx.of(false);
    }

    interface CellProps {
        row: TimeTableRow<T>;
        hour: number;
        minute: number;
    }
    function Cell(props: CellProps) {
        const { row, hour, minute } = props;
        const isSelected = isCellSelected(row, hour, minute);
        return (
            <div
                class={[
                    "rom-time-table-cell",
                    selection.lift((sel) =>
                        isSelected(sel) ? "rom-time-table-cell--selected" : null
                    ),
                ]}
                style={"background-color: " + row.bgColor(hour, minute)}
                data-minute={minute}
                style_background="
    cellColor
        | apply
            : row[hour][minute]
            : (isCellSelected
                  | apply
                      : selection
                      : row.identifier
                      : hour
                      : minute)
"
                ngClass="{
    'rom-time-table-cell--selected':
        isCellSelected
        | apply: selection:row.identifier:hour:minute
}"
            >
                <a class="rom-time-table-cell__content">
                    {cellContentTemplate(row, hour, minute)}
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

{
    /* 
<ng-template #menuItemsTemplate let-timeUnit="timeUnit">
    <div class="menu">
        <span matMenuTriggerFor="menu"
            >{ 'planning_time_unit_short' | locale }
            <span If="timeUnit < 60"
                >({ timeUnit }{ 'minutes_short_lc' | locale })</span
            >
            <span If="timeUnit === 60"
                >(1{ 'hour_short_lc' | locale })</span
            >
        </span>
    </div>
    <mat-menu menu="matMenu">
        <button mat-menu-item matMenuTriggerFor="timeUnitMenu">
            <mat-icon>alarm</mat-icon>
            <span>{ 'planning_time_unit' | locale }</span>
        </button>
        <button mat-menu-item click="onExpandAll()">
            <mat-icon>expand_more</mat-icon>
            <span>{ 'expand_all' | locale }</span>
        </button>
        <button mat-menu-item click="onCollapseAll()">
            <mat-icon>expand_less</mat-icon>
            <span>{ 'collapse_all' | locale }</span>
        </button>
    </mat-menu>
    <mat-menu #timeUnitMenu="matMenu">
        <button
            mat-menu-item
            class_active="timeUnit === 5"
            click="setTimeUnit(5)"
        >
            5 { 'minutes_lc' | locale }
        </button>
        <button
            mat-menu-item
            class_active="timeUnit === 10"
            click="setTimeUnit(10)"
        >
            10 { 'minutes_lc' | locale }
        </button>
        <button
            mat-menu-item
            class_active="timeUnit === 15"
            click="setTimeUnit(15)"
        >
            15 { 'minutes_lc' | locale }
        </button>
        <button
            mat-menu-item
            class_active="timeUnit === 20"
            click="setTimeUnit(20)"
        >
            20 { 'minutes_lc' | locale }
        </button>
        <button
            mat-menu-item
            class_active="timeUnit === 30"
            click="setTimeUnit(30)"
        >
            30 { 'minutes_lc' | locale }
        </button>
        <button
            mat-menu-item
            class_active="timeUnit === 60"
            click="setTimeUnit(60)"
        >
            1 { 'hour_lc' | locale }
        </button>
    </mat-menu>
</ng-template> */
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
