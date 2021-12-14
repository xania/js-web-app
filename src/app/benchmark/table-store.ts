import { ListMutation, ListMutationType } from "@xania/glow.js";
import { asProxy, Expression, Store } from "@xania/mutabl.js";

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
  constructor(
    private list: { add(mut: ListMutation<Expression<DataRow>>): any }
  ) {}

  private data: Store<DataRow>[] = [];

  selected?: typeof this.data[number];

  select = (row: typeof this.selected) => {
    const { selected } = this;
    if (selected !== row) {
      if (selected) {
        selected.property("className").update(null);
      }
      if (row) {
        row.property("className").update("danger");
      }
      this.selected = row;
    }
  };

  private appendRows(count: number) {
    let { counter } = this;
    for (let i = 0; i < count; i++) {
      var row = createRow(
        counter++,
        adjectives[_random(adjectives.length)] +
          " " +
          colours[_random(colours.length)] +
          " " +
          nouns[_random(nouns.length)]
      );
      this.data.push(row);
      this.list.add({
        type: 0 /* push */,
        values: asProxy(row),
      });
    }
    this.counter = counter;
  }
  create1000Rows = (): void => {
    this.appendRows(1000);
  };
  create10000Rows = (): void => {
    this.appendRows(10000);
  };
  append1000Rows = (): void => {
    this.appendRows(1000);
  };
  updateEvery10thRow = (): void => {
    const { length } = this.data;
    for (let i = 9; i < length; i += 10) {
      this.data[i].property("label").update((prev) => prev + " !!!");
    }
  };
  clear = (): void => {
    this.list.add({
      type: ListMutationType.CLEAR,
    });
    this.counter = 1;
  };
  swapRows = (): void => {
    if (this.data.length > 998) {
      const x = this.data[998];
      const y = this.data[1];
      const tmp = x.value;
      x.update(y.value);
      y.update(tmp);
    }
  };
}

function createRow(id: number, label: string) {
  return new Store<DataRow>({
    id,
    label,
  });
}

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}
