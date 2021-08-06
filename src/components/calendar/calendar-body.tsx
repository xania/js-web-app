// /**
//  * @license
//  * Copyright Google LLC All Rights Reserved.
//  *
//  * Use of this source code is governed by an MIT-style license that can be
//  * found in the LICENSE file at https://angular.io/license
//  */

// import { Store } from "../../../mutabl.js";
// import If from "glow.js/components/if";

// import tpl from "glow.js";
// import {
//     Blur,
//     Event,
//     Focus,
//     MouseEnter,
//     MouseLeave,
// } from "glow.js/components/event";
// import { EventEmitter } from "../core";

// type SimpleChanges = any;

// /** Extra CSS classes that can be associated with a calendar cell. */
// export type MatCalendarCellCssClasses =
//     | string
//     | string[]
//     | Set<string>
//     | { [key: string]: any };

// /** Function that can generate the extra classes that should be added to a calendar cell. */
// export type MatCalendarCellClassFunction<D> = (
//     date: D,
//     view: "month" | "year" | "multi-year"
// ) => MatCalendarCellCssClasses;

// /**
//  * An internal class that represents the data corresponding to a single calendar cell.
//  * @docs-private
//  */
// export class MatCalendarCell<D = any> {
//     constructor(
//         public value: number,
//         public displayValue: string,
//         public ariaLabel: string,
//         public enabled: boolean,
//         public cssClasses: MatCalendarCellCssClasses = {},
//         public compareValue = value,
//         public rawValue?: D
//     ) {}
// }

// /** Event emitted when a date inside the calendar is triggered as a result of a user action. */
// export interface MatCalendarUserEvent<D> {
//     value: D;
//     event: Event;
// }

// //   /**
// //    * An internal component used to display calendar data in a table.
// //    * @docs-private
// //    */
// //   @Component({
// //     selector: '[mat-calendar-body]',
// //     templateUrl: 'calendar-body.html',
// //     styleUrls: ['calendar-body.css'],
// //     host: {
// //       'class': 'mat-calendar-body',
// //       'role': 'grid',
// //       'aria-readonly': 'true'
// //     },
// //   })

// interface MatCalendarBodyProps {
//     label: string;
//     rows: MatCalendarCell[][];
//     todayValue: number;
//     startValue: number;
//     endValue: number;
//     /** The minimum number of free cells needed to fit the label in the first row. */
//     labelMinRequiredCells: number;

//     /** The number of columns in the table. */
//     numCols: number;

//     /** The cell number of the active cell in the table. */
//     activeCell: number;

//     /** Whether a range is being selected. */
//     isRange: boolean;
//     /**
//      * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
//      * maintained even as the table resizes.
//      */
//     cellAspectRatio: number;

//     /** Start of the comparison range. */
//     comparisonStart: number | null;

//     /** End of the comparison range. */
//     comparisonEnd: number | null;

//     /** Start of the preview range. */
//     previewStart: number | null;

//     /** End of the preview range. */
//     previewEnd: number | null;
// }

// interface MatCalendarBodyState {
//     /** The number of blank cells to put at the beginning for the first row. */
//     firstRowOffset: number;

//     /** Padding for the individual date cells. */
//     cellPadding: string;

//     /** Width of an individual cell. */
//     cellWidth: string;
// }

// export class MatCalendarBody {
//     /**
//      *
//      */
//     private state: Store<MatCalendarBodyState>;

//     /** The number of blank cells to put at the beginning for the first row. */
//     _firstRowOffset: number;

//     /** Padding for the individual date cells. */
//     _cellPadding: string;

//     constructor(
//         private props: Partial<MatCalendarBodyProps> = {
//             isRange: false,
//             activeCell: 0,
//             numCols: 7,
//             previewStart: null,
//             previewEnd: null,
//             cellAspectRatio: 1,
//         }
//     ) {
//         this.state = new Store<MatCalendarBodyState>();
//     }

//     get view() {
//         const { label, numCols, labelMinRequiredCells } = this.props;
//         const { _firstRowOffset, _cellPadding } = this;
//         return (
//             <calendar-body>
//                 <MouseEnter callback={this._enterHandler} />
//                 <Focus callback={this._enterHandler} />
//                 <MouseLeave callback={this._enterHandler} />
//                 <Blur callback={this._enterHandler} />
//                 <If condition={_firstRowOffset < labelMinRequiredCells}>
//                     <tr aria-hidden="true">
//                         <td
//                             class="mat-calendar-body-label"
//                             colspan={numCols}
//                             style={`padding-top: ${_cellPadding}; padding-bottom: ${_cellPadding}`}
//                         >
//                             {label}
//                         </td>
//                     </tr>
//                 </If>
//             </calendar-body>
//         );
//     }
//     /**
//      * Used to skip the next focus event when rendering the preview range.
//      * We need a flag like this, because some browsers fire focus events asynchronously.
//      */
//     private _skipNextFocus: boolean;

//     /** Emits when a new value is selected. */
//     public readonly selectedValueChange: EventEmitter<
//         MatCalendarUserEvent<number>
//     > = new EventEmitter<MatCalendarUserEvent<number>>();

//     /** Emits when the preview has changed as a result of a user action. */
//     previewChange = new EventEmitter<
//         MatCalendarUserEvent<MatCalendarCell | null>
//     >();

//     // constructor(
//     //     private _elementRef: ElementRef<HTMLElement>,
//     //     private _ngZone: NgZone
//     // ) {
//     //     _ngZone.runOutsideAngular(() => {
//     //         const element = _elementRef.nativeElement;
//     //         element.addEventListener("mouseenter", this._enterHandler, true);
//     //         element.addEventListener("focus", this._enterHandler, true);
//     //         element.addEventListener("mouseleave", this._leaveHandler, true);
//     //         element.addEventListener("blur", this._leaveHandler, true);
//     //     });
//     // }

//     /** Called when a cell is clicked. */
//     _cellClicked(cell: MatCalendarCell, event: MouseEvent): void {
//         if (cell.enabled) {
//             this.selectedValueChange.emit({ value: cell.value, event });
//         }
//     }

//     /** Returns whether a cell should be marked as selected. */
//     _isSelected(value: number) {
//         const { startValue, endValue } = this.props;
//         return startValue === value || endValue === value;
//     }

//     onChanges(changes: SimpleChanges) {
//         const columnChanges = changes["numCols"];
//         const { rows, numCols } = this.props;

//         if (changes["rows"] || columnChanges) {
//             this.state
//                 .property("firstRowOffset")
//                 .update(
//                     rows && rows.length && rows[0].length
//                         ? numCols - rows[0].length
//                         : 0
//                 );
//         }

//         if (changes["cellAspectRatio"] || columnChanges) {
//             this.state
//                 .property("cellPadding")
//                 .update(
//                     (cp) =>
//                         cp || `${(50 * this.props.cellAspectRatio) / numCols}%`
//                 );
//         }

//         if (columnChanges) {
//             this.state
//                 .property("cellWidth")
//                 .update((cw) => cw || `${100 / numCols}%`);
//         }
//     }

//     /** Returns whether a cell is active. */
//     _isActiveCell(rowIndex: number, colIndex: number): boolean {
//         let cellNumber = rowIndex * this.props.numCols + colIndex;

//         // Account for the fact that the first row may not have as many cells.
//         if (rowIndex) {
//             cellNumber -= this.state.property("firstRowOffset").peek((e) => e);
//         }

//         return cellNumber == this.props.activeCell;
//     }

//     /** Focuses the active cell after the microtask queue is empty. */
//     _focusActiveCell(movePreview = true) {
//         throw new Error("Not Yet Implemented!");
//         // const activeCell: HTMLElement | null = this._elementRef.nativeElement.querySelector(
//         //     ".mat-calendar-body-active"
//         // );
//         // if (activeCell) {
//         //     if (!movePreview) {
//         //         this._skipNextFocus = true;
//         //     }
//         //     activeCell.focus();
//         // }
//     }

//     /** Gets whether a value is the start of the main range. */
//     _isRangeStart(value: number) {
//         return isStart(value, this.props.startValue, this.props.endValue);
//     }

//     /** Gets whether a value is the end of the main range. */
//     _isRangeEnd(value: number) {
//         return isEnd(value, this.props.startValue, this.props.endValue);
//     }

//     /** Gets whether a value is within the currently-selected range. */
//     _isInRange(value: number): boolean {
//         return isInRange(
//             value,
//             this.props.startValue,
//             this.props.endValue,
//             this.props.isRange
//         );
//     }

//     /** Gets whether a value is the start of the comparison range. */
//     _isComparisonStart(value: number) {
//         return isStart(
//             value,
//             this.props.comparisonStart,
//             this.props.comparisonEnd
//         );
//     }

//     /** Whether the cell is a start bridge cell between the main and comparison ranges. */
//     _isComparisonBridgeStart(
//         value: number,
//         rowIndex: number,
//         colIndex: number
//     ) {
//         if (
//             !this._isComparisonStart(value) ||
//             this._isRangeStart(value) ||
//             !this._isInRange(value)
//         ) {
//             return false;
//         }

//         let previousCell: MatCalendarCell | undefined = this.props.rows[
//             rowIndex
//         ][colIndex - 1];

//         if (!previousCell) {
//             const previousRow = this.props.rows[rowIndex - 1];
//             previousCell = previousRow && previousRow[previousRow.length - 1];
//         }

//         return previousCell && !this._isRangeEnd(previousCell.compareValue);
//     }

//     /** Whether the cell is an end bridge cell between the main and comparison ranges. */
//     _isComparisonBridgeEnd(value: number, rowIndex: number, colIndex: number) {
//         if (
//             !this._isComparisonEnd(value) ||
//             this._isRangeEnd(value) ||
//             !this._isInRange(value)
//         ) {
//             return false;
//         }

//         let nextCell: MatCalendarCell | undefined = this.props.rows[rowIndex][
//             colIndex + 1
//         ];

//         if (!nextCell) {
//             const nextRow = this.props.rows[rowIndex + 1];
//             nextCell = nextRow && nextRow[0];
//         }

//         return nextCell && !this._isRangeStart(nextCell.compareValue);
//     }

//     /** Gets whether a value is the end of the comparison range. */
//     _isComparisonEnd(value: number) {
//         return isEnd(
//             value,
//             this.props.comparisonStart,
//             this.props.comparisonEnd
//         );
//     }

//     /** Gets whether a value is within the current comparison range. */
//     _isInComparisonRange(value: number) {
//         return isInRange(
//             value,
//             this.props.comparisonStart,
//             this.props.comparisonEnd,
//             this.props.isRange
//         );
//     }

//     /**
//      * Gets whether a value is the same as the start and end of the comparison range.
//      * For context, the functions that we use to determine whether something is the start/end of
//      * a range don't allow for the start and end to be on the same day, because we'd have to use
//      * much more specific CSS selectors to style them correctly in all scenarios. This is fine for
//      * the regular range, because when it happens, the selected styles take over and still show where
//      * the range would've been, however we don't have these selected styles for a comparison range.
//      * This function is used to apply a class that serves the same purpose as the one for selected
//      * dates, but it only applies in the context of a comparison range.
//      */
//     _isComparisonIdentical(value: number) {
//         // Note that we don't need to null check the start/end
//         // here, because the `value` will always be defined.
//         return (
//             this.props.comparisonStart === this.props.comparisonEnd &&
//             value === this.props.comparisonStart
//         );
//     }

//     /** Gets whether a value is the start of the preview range. */
//     _isPreviewStart(value: number) {
//         return isStart(value, this.props.previewStart, this.props.previewEnd);
//     }

//     /** Gets whether a value is the end of the preview range. */
//     _isPreviewEnd(value: number) {
//         return isEnd(value, this.props.previewStart, this.props.previewEnd);
//     }

//     /** Gets whether a value is inside the preview range. */
//     _isInPreview(value: number) {
//         return isInRange(
//             value,
//             this.props.previewStart,
//             this.props.previewEnd,
//             this.props.isRange
//         );
//     }

//     /**
//      * Event handler for when the user enters an element
//      * inside the calendar body (e.g. by hovering in or focus).
//      */
//     private _enterHandler = (event: Event) => {
//         if (this._skipNextFocus && event.type === "focus") {
//             this._skipNextFocus = false;
//             return;
//         }

//         // We only need to hit the zone when we're selecting a range.
//         if (event.target && this.props.isRange) {
//             const cell = this._getCellFromElement(event.target as HTMLElement);

//             if (cell) {
//                 this.previewChange.emit({
//                     value: cell.enabled ? cell : null,
//                     event,
//                 });
//             }
//         }
//     };

//     /**
//      * Event handler for when the user's pointer leaves an element
//      * inside the calendar body (e.g. by hovering out or blurring).
//      */
//     private _leaveHandler = (event: Event) => {
//         // We only need to hit the zone when we're selecting a range.
//         if (this.props.previewEnd !== null && this.props.isRange) {
//             // Only reset the preview end value when leaving cells. This looks better, because
//             // we have a gap between the cells and the rows and we don't want to remove the
//             // range just for it to show up again when the user moves a few pixels to the side.
//             if (event.target && isTableCell(event.target as HTMLElement)) {
//                 this.previewChange.emit({ value: null, event });
//             }
//         }
//     };

//     /** Finds the MatCalendarCell that corresponds to a DOM node. */
//     private _getCellFromElement(element: HTMLElement): MatCalendarCell | null {
//         let cell: HTMLElement | undefined;

//         if (isTableCell(element)) {
//             cell = element;
//         } else if (isTableCell(element.parentNode!)) {
//             cell = element.parentNode as HTMLElement;
//         }

//         if (cell) {
//             const row = cell.getAttribute("data-mat-row");
//             const col = cell.getAttribute("data-mat-col");

//             if (row && col) {
//                 return this.props.rows[parseInt(row)][parseInt(col)];
//             }
//         }

//         return null;
//     }
// }

// /** Checks whether a node is a table cell element. */
// function isTableCell(node: Node): node is HTMLTableCellElement {
//     return node.nodeName === "TD";
// }

// /** Checks whether a value is the start of a range. */
// function isStart(
//     value: number,
//     start: number | null,
//     end: number | null
// ): boolean {
//     return end !== null && start !== end && value < end && value === start;
// }

// /** Checks whether a value is the end of a range. */
// function isEnd(
//     value: number,
//     start: number | null,
//     end: number | null
// ): boolean {
//     return start !== null && start !== end && value >= start && value === end;
// }

// /** Checks whether a value is inside of a range. */
// function isInRange(
//     value: number,
//     start: number | null,
//     end: number | null,
//     rangeEnabled: boolean
// ): boolean {
//     return (
//         rangeEnabled &&
//         start !== null &&
//         end !== null &&
//         start !== end &&
//         value >= start &&
//         value <= end
//     );
// }
