import { ViewContext, State, ViewContainer } from "@xania/view";

export interface DataRow {
  id: number;
  label: string;
  className?: string;
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

  selected?: DataRow;

  select = (context: ViewContext<DataRow>) => {
    const row = context?.values;
    const { selected } = this;
    if (selected !== row) {
      if (selected) {
        // this.container.update()
        // selected.className.update(() => null);
      }
      if (row) {
        // row.className.update(() => "danger");
      }
      this.selected = row;
    }
  };

  delete = (context: ViewContext<DataRow>) => {
    this.container.remove(context);
  };

  private appendRows(count: number) {
    let { counter, container } = this;
    const data = new Array(count);
    for (let i = 0; i < count; i++) {
      data[i] = {
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
    }

    container.push(data);
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
    const { container } = this;
    const length = container.length;

    for (let i = 0; i < length; i += 10) {
      container.updateAt(i, (row) => (row.label += " !!!"));
    }
  };
  clear = (): void => {
    this.container.clear();
    this.select(null);
  };
  swapRows = (): void => {
    if (this.container.length > 4) {
      this.container.swap(1, 4);
    }
  };
}

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}
