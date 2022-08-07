import { ViewContainer } from "@xania/view";
// import type { JSX } from "@xania/view/types/jsx";

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

  selected?: Node | null | undefined;

  select = (e: { node: Node }) => {
    const { selected, container } = this;
    const node = e.node;
    if (selected !== node) {
      const newIndex = node["rowIndex"];
      container.update(
        (row) => ((row.className = "danger"), "className"),
        newIndex
      );

      if (selected?.parentNode) {
        const oldIndex = selected["rowIndex"];
        container.update(
          (row) => ((row.className = null), "className"),
          oldIndex
        );
      }

      this.selected = node;
    }
  };

  delete = (e: { node: Node }) => {
    this.container.removeAt(e.node["rowIndex"]);
  };

  private appendRows(count: number) {
    let { counter, container: view } = this;
    const data = new Array(count);
    for (let i = 0; i < count; i++) {
      data[i] = {
        id: counter++,
        label:
          adjectives[_random(adjectives.length)] +
          " " +
          colours[_random(colours.length)] +
          " " +
          nouns[_random(nouns.length)],
        className: null,
      };
    }

    view.push(data);
    this.counter = counter;
  }

  create1000Rows = (): void => {
    this.clear();
    this.appendRows(2);
  };
  create10000Rows = (): void => {
    this.clear();
    this.appendRows(10000);
  };
  append1000Rows = (): void => {
    this.appendRows(2);
  };

  updateEvery10thRow = (): void => {
    const { container: view } = this;

    view.update((row, idx) => {
      if (idx % 10 === 0) {
        row.label += " !!!";
        return "label";
      }
    });
  };
  clear = (): void => {
    this.container.clear();
    this.selected = null;
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
