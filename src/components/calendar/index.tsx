// import jsx from "@xania/glow.js";
// import { Store } from "../../../mutabl.js";
// import { Property } from "../../../mutabl.js/lib/observable";
// import { DateAdapter } from "../core/date-time/date-adapter.js";
// import { DateRange } from "../date-picker/date-selection-model.js";
// import MatMonthView from "../date-picker/month-view";
// import { createCustomElement } from '@angular/elements';

// export type CurrentView = "year" | "multi-year" | "month";

// export interface MatCalendarState<D> {
//     activeDate: D;
//     currentView: CurrentView;
//     selected: DateRange<D> | D | null;
// }

// export interface MatCalendarProps<D> {
//     dateAdapter: DateAdapter<D>;
//     minDate?: D;
//     maxDate?: D;
// }

// export default class MatCalendar<D> {
//     get activeDate(): Property<D> {
//         return this.state.property("activeDate");
//     }

//     get currentView(): Property<CurrentView> {
//         return this.state.property("currentView");
//     }

//     readonly state: Store<MatCalendarState<D>>;

//     public readonly minDate: D;
//     public readonly maxDate: D;

//     constructor(private props: MatCalendarProps<D>) {
//         this.state = new Store<MatCalendarState<D>>();
//     }

//     get selected() {
//         return this.state.property("selected");
//     }

//     select(value: DateRange<D> | D | null) {
//         const { dateAdapter } = this.props;
//         if (value instanceof DateRange) {
//             this.state.property("selected").update(value);
//         } else {
//             this.state
//                 .property("selected")
//                 .update(
//                     dateAdapter.getValidDateOrNull(
//                         dateAdapter.deserialize(value)
//                     )
//                 );
//         }
//     }
//     dateSelected = (evt: Event) => {};

//     get view() {
//         const { minDate, maxDate } = this.props;

//         createCustomElement(MatCalendar, null);
//         return (
//             <div class="mat-calendar-content">
//                 <MatMonthView
//                     activeDate={this.activeDate}
//                     selected={this.selected}
//                     dateFilter="dateFilter"
//                     minDate={minDate}
//                     maxDate={maxDate}
//                     dateClass="dateClass"
//                     comparisonStart="comparisonStart"
//                     comparisonEnd="comparisonEnd"
//                     _userSelection={this.dateSelected}
//                 ></MatMonthView>
//             </div>
//         );
//     }
// }
