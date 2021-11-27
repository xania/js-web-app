import { ListMutation } from "@xania/glow.js";

export interface Row {
  id: number;
  label: string;
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
  constructor(private list: { add(mut: ListMutation<Row>): any }) {}

  private appendRows(count: number) {
    let { counter } = this;
    for (let i = 0; i < count; i++) {
      this.list.add({
        type: 0 /* push */,
        values: createRow(
          counter++,
          adjectives[_random(adjectives.length)] +
            " " +
            colours[_random(colours.length)] +
            " " +
            nouns[_random(nouns.length)]
        ),
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
  updateEvery10thRow = (): void => {};
  clear = (): void => {};
  swapRows = (): void => {};
}

function createRow(id: number, label: string) {
  return {
    id,
    label,
  };
}

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}
