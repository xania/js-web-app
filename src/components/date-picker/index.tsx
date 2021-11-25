import { MDCMenuSurface } from "@material/menu-surface";
import tpl from "@xania/glow.js";
import { DateAdapter } from "../core/date-time/date-adapter";
import TextField from "../text-field";
import "./style.scss";

interface DatePickerProps {
  label: string;
}
export default function DatePicker(props: DatePickerProps) {
  const { label = null } = props || {};
  let surfaceView = new ChildView(MDCMenuSurface.attachTo);

  // const elt = createCustomElement(MatCalendar, { injector: null });
  // console.log(elt);

  fetch("https://www.sepay.nl/mysepay/Transactions.aspx", {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en,en-US;q=0.9,nl;q=0.8,ar;q=0.7",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    referrer: "https://www.sepay.nl/mysepay/Transactions.aspx",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: "viewstatekey=77240164-f835-47f9-99a6-daf2c3a3018b&ctl00%24hidPageID=f55287f1-880a-4d50-9d87-efbaea5ad249&ctl00%24ContentPlaceHolder1%24tbDateFrom=21-04-2021+00%3A00&ctl00%24ContentPlaceHolder1%24tbDateTo=01-05-2021+00%3A00&ctl00%24ContentPlaceHolder1%24tbAmountMin=&ctl00%24ContentPlaceHolder1%24tbAmountMax=&ctl00%24ContentPlaceHolder1%24lstDownloadType=CSV&ctl00%24ContentPlaceHolder1%24btnDownload=Download&__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=&__SCROLLPOSITIONX=0&__SCROLLPOSITIONY=0&__EVENTVALIDATION=%2FwEdABmvVXD1oYELeveMr0vHCmYP1BcR4IQKU%2FN%2FmJan6AT4FxoelvNk8V12GEez%2BkZvF88SIkf31abdD2k7vds0J8m482iMaitz6%2Bv1d0EIZg0Rhim1TAakfKozq1SXIQw34wKHQp9TUIS%2FwOmNI5z5tJZRJGPa5%2FY1hAkErbROroFMVZfMTS5lZ8pvvm%2F4ZhUdp3gi%2F2OAVs8zDA2w4C9AM9w7G0OX1cPRSiahZqNBlGInm9K0tYQX6E1J3apaOXoBUDPyR%2Fyp9K1P4rDimmJ5pgcfV3SVwCzae0m4A5H2lh3A8kQwr0KZx0dLRhTcTC1F%2FLqAasvFAkMO02AI1HwJR98%2FOIxNxu9f7htthfNKaz3piBTVkyyEShPXUuWfpHyqJ7qDIQ9ZmnSbZGM3J1RZ5zDRj5oLjgavrwy9hAdO31OjH%2F8vXHXRCSwSlC9VlLc1BokESF1eL4D%2BPa8gDSO02PwxkrQ%2BjbuJgXbtQO0MHmKJAnpMIFzpE9voX2%2FFdgxGXRMGdk0AyMo5L7R9pncoWpw0a6wEqw5Gz%2BzYmaEyyIFVpcH4SUZgy2Pf1CM0XuDUE2E%3D",
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  return (
    <div>
      <TextField label={label} events={{ mouseup: toggleOpen }} />
      <div class="mdc-menu-surface--anchor" style="position: relative;">
        <div class="mdc-menu-surface" style="padding: 20px">
          {surfaceView}
          surface
        </div>
      </div>
    </div>
  );

  function toggleOpen(e) {
    surfaceView.call((elt) => elt.isOpen && elt.open());
  }
}

class ChildView<T> {
  public element?: T;

  constructor(private fn: (dom) => T) {}

  call(fn: (elt: T) => any) {
    const { element } = this;
    if (element) {
      fn(element);
    }
  }

  attachTo(dom) {
    this.element = this.fn(dom);
  }
}

interface InvariantDate {
  year: number;
  month: number;
  date: number;
}
class InvariantDateAdapter extends DateAdapter<InvariantDate> {
  getYear(date: InvariantDate): number {
    return date.year;
  }
  getMonth(date: InvariantDate): number {
    return date.month;
  }
  getDate(date: InvariantDate): number {
    return date.date;
  }
  getDayOfWeek(date: InvariantDate): number {
    return new Date(date.year, date.month, date.date).getDay();
  }
  getMonthNames(style: "long" | "short" | "narrow"): string[] {
    return [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  }
  getDateNames(): string[] {
    return ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
  }
  getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
    return ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
  }
  getYearName(date: InvariantDate): string {
    return date.year.toString();
  }
  getFirstDayOfWeek(): number {
    return 0;
  }
  getNumDaysInMonth(date: InvariantDate): number {
    return 30;
  }
  clone(date: InvariantDate): InvariantDate {
    return { ...date };
  }
  createDate(year: number, month: number, date: number): InvariantDate {
    return { year, month, date };
  }
  today(): InvariantDate {
    var d = new Date();
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      date: d.getDate(),
    };
  }
  parse(value: any, parseFormat: any): InvariantDate {
    throw new Error("Method not implemented.");
  }
  format(date: InvariantDate, displayFormat: any): string {
    throw new Error("Method not implemented.");
  }
  addCalendarYears(date: InvariantDate, years: number): InvariantDate {
    return { ...date, year: date.year + years };
  }
  addCalendarMonths(date: InvariantDate, months: number): InvariantDate {
    return { ...date, month: date.month + months };
  }
  addCalendarDays(date: InvariantDate, days: number): InvariantDate {
    return { ...date, date: date.date + days };
  }
  toIso8601(date: InvariantDate): string {
    throw new Error("Method not implemented.");
  }
  isDateInstance(obj: any): boolean {
    return obj && "year" in obj && "month" in obj && "date" in obj;
  }
  isValid(date: InvariantDate): boolean {
    return !!date;
  }
  invalid(): InvariantDate {
    return null;
  }
}
