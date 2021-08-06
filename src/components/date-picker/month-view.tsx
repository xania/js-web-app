import { Property } from "../../../mutabl.js/lib/observable";
import { DateRange } from "./date-selection-model";

interface MatMonthViewProps<D> {
    activeDate: Property<D>;
    selected: Property<DateRange<D> | D | null>;
    dateFilter: string;
    minDate: D;
    maxDate: D;
}

export default class MatMonthView<D> {
    /**
     *
     */
    constructor(private props: MatMonthViewProps<D>) {}
    get view() {
        return "month view";
    }
}
