import { State, ViewContainer } from "@xania/view";

export interface DataRow {
  id: number;
  label: State<string>;
  className?: State<string>;
}

var adjectives = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
];
var colours = [
  "red",
  "yellow",
  "blue",
  "green",
  "pink",
  "brown",
  "purple",
  "brown",
  "white",
  "black",
  "orange",
];
var nouns = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard",
];

export class TableStore {
  private counter = 1;
  constructor(private container: ViewContainer<DataRow>) {}

  private data: DataRow[] = [];

  selected?: DataRow;

  select = (row: DataRow) => {
    const { selected } = this;
    if (selected !== row) {
      if (selected) {
        selected.className.update(() => null);
      }
      if (row) {
        row.className.update(() => "danger");
      }
      this.selected = row;
    }
  };

  delete = ({ values }) => {
    this.container.remove(values);
  };

  private appendRows(count: number) {
    let { counter, data, container } = this;
    for (let i = 0; i < count; i++) {
      var row = {
        id: counter++,
        label: new State(
          adjectives[_random(adjectives.length)] +
            " " +
            colours[_random(colours.length)] +
            " " +
            nouns[_random(nouns.length)]
        ),
        className: new State(null),
      };
      data.push(row);
    }

    container.push(data, data.length - count, count);
    this.counter = counter;
  }
  create1000Rows = (): void => {
    this.clear();
    this.appendRows(1000);
  };
  create10000Rows = (): void => {
    this.clear();
    this.appendRows(10000);
  };
  append1000Rows = (): void => {
    this.appendRows(1000);
  };
  updateEvery10thRow = (): void => {
    const { length } = this.data;
    for (let i = 0; i < length; i += 10) {
      this.data[i].label.update((prev) => prev + " !!!");
    }
  };
  clear = (): void => {
    this.container.clear();
    this.data = [];
    this.select(null);
  };
  swapRows = (): void => {
    if (this.data.length > 998) {
      this.container.swap(1, 4);
    }
  };
}

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}
