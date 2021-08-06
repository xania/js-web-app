// import tpl from "glow.js";
// import MatCalendar, { CurrentView } from ".";
// import { Store } from "../../../mutabl.js";
// import { DateAdapter } from "../core/date-time/date-adapter";

// let uniqueId = 0;
// const yearsPerPage = 24;

// interface MatCalendarHeaderProps<D> {
//     periodButtonText: string;
//     periodButtonLabel: string;
//     calendar: MatCalendar<D>;
//     minDate: D;
//     maxDate: D;
//     prevButtonLabel: string;
//     dateAdapter: DateAdapter<D>;
//     _intl: any;
//     click: () => any;
// }

// interface MatCalendarHeaderState {}
// export default class MatCalendarHeader<D> {
//     private state: Store<MatCalendarHeaderState>;
//     private readonly _buttonDescriptionId = `mat-calendar-button-${uniqueId++}`;

//     constructor(
//         private props: MatCalendarHeaderProps<D>,
//         private children: any
//     ) {
//         this.state = new Store<MatCalendarHeaderState>();
//     }

//     currentPeriodClicked = () => {
//         this.props.calendar.currentView.update((cv) =>
//             cv == "month" ? "multi-year" : "month"
//         );
//     };

//     get prevButtonLabel() {
//         const { calendar, _intl } = this.props;
//         return calendar.currentView.lift(
//             (cv) =>
//                 ({
//                     month: _intl.prevMonthLabel,
//                     year: _intl.prevYearLabel,
//                     "multi-year": _intl.prevMultiYearLabel,
//                 }[cv])
//         );
//     }

//     get nextButtonLabel() {
//         const { calendar, _intl } = this.props;
//         return calendar.currentView.lift(
//             (cv) =>
//                 ({
//                     month: _intl.nextMonthLabel,
//                     year: _intl.nextYearLabel,
//                     "multi-year": _intl.nextMultiYearLabel,
//                 }[cv])
//         );
//     }

//     previousEnabled() {
//         const { calendar } = this.props;
//         if (!calendar.minDate) {
//             return true;
//         }

//         return calendar.state.lift(
//             ({ activeDate, currentView }) =>
//                 !this._isSameView(
//                     currentView,
//                     activeDate,
//                     calendar.minDate,
//                     calendar
//                 )
//         );
//     }

//     nextEnabled() {
//         const { calendar } = this.props;
//         if (!calendar.maxDate) {
//             return true;
//         }

//         return calendar.state.lift(
//             ({ activeDate, currentView }) =>
//                 !this._isSameView(
//                     currentView,
//                     activeDate,
//                     calendar.maxDate,
//                     calendar
//                 )
//         );
//     }

//     _isSameView(
//         currentView: CurrentView,
//         date1: D,
//         date2: D,
//         range: { minDate: D; maxDate: D }
//     ): boolean {
//         const { dateAdapter } = this.props;
//         if (currentView == "month") {
//             return (
//                 dateAdapter.getYear(date1) == dateAdapter.getYear(date2) &&
//                 dateAdapter.getMonth(date1) == dateAdapter.getMonth(date2)
//             );
//         }
//         if (currentView == "year") {
//             return dateAdapter.getYear(date1) == dateAdapter.getYear(date2);
//         }
//         // Otherwise we are in 'multi-year' view.
//         throw Error("Not yet ported!");
//     }

//     /** Handles user clicks on the previous button. */
//     previousClicked = () => {
//         const { dateAdapter, calendar } = this.props;
//         calendar.activeDate.update((ad) =>
//             calendar.currentView.peek((cv) =>
//                 cv == "month"
//                     ? dateAdapter.addCalendarMonths(ad, -1)
//                     : dateAdapter.addCalendarYears(
//                           ad,
//                           cv == "year" ? -1 : -yearsPerPage
//                       )
//             )
//         );
//     };

//     /** Handles user clicks on the next button. */
//     nextClicked = () => {
//         const { dateAdapter, calendar } = this.props;
//         calendar.activeDate.update((ad) =>
//             calendar.currentView.peek((cv) =>
//                 cv == "month"
//                     ? dateAdapter.addCalendarMonths(ad, 1)
//                     : dateAdapter.addCalendarYears(
//                           ad,
//                           cv == "year" ? 1 : yearsPerPage
//                       )
//             )
//         );
//     };

//     get view() {
//         const { props, _buttonDescriptionId, children } = this;
//         return (
//             <div class="mat-calendar-header">
//                 <div class="mat-calendar-controls">
//                     <button
//                         mat-button
//                         type="button"
//                         class="mat-calendar-period-button"
//                         click={this.currentPeriodClicked}
//                         aria-label={props.periodButtonLabel}
//                         aria-describedby={_buttonDescriptionId}
//                         cdkAriaLive="polite"
//                     >
//                         <span id={_buttonDescriptionId}>
//                             {props.periodButtonText}
//                         </span>
//                         <div
//                             class={[
//                                 "mat-calendar-arrow",
//                                 props.calendar.currentView.lift(
//                                     (e) => e !== "month"
//                                 ),
//                             ]}
//                         ></div>
//                     </button>

//                     <div class="mat-calendar-spacer"></div>

//                     {children}

//                     <button
//                         mat-icon-button
//                         type="button"
//                         class="mat-calendar-previous-button"
//                         disabled={!this.previousEnabled}
//                         click={this.previousClicked}
//                         aria-label={this.prevButtonLabel}
//                     ></button>

//                     <button
//                         mat-icon-button
//                         type="button"
//                         class="mat-calendar-next-button"
//                         disabled={!this.nextEnabled}
//                         click={this.nextClicked}
//                         aria-label={this.nextButtonLabel}
//                     ></button>
//                 </div>
//             </div>
//         );
//     }
// }
