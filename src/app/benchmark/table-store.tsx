import { createView, useContext, View } from "@xania/view";
import { createElement as jsx } from "@xania/view";

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
  private data: DataRow[] = [];
  public view: View<DataRow>;

  constructor() {
    this.view = createView<DataRow>(
      <Row select={this.select} delete={this.delete} />
    );
  }

  selected: DataRow | null = null;

  run = () => {
    const { view: container, data } = this;
    step(0);
    function step(idx: number) {
      if (idx < data.length && idx < 500) {
        data[idx].className = "danger";
        if (idx > 0) {
          data[idx - 1].className = null;
        }
        container.update(data);
        setTimeout(function () {
          step(idx + 1);
        }, 0);
      }
    }
  };

  select = (e: { values: DataRow }) => {
    const { selected, view, data } = this;
    const values = e.values;
    if (selected !== values) {
      const newValues = values;
      newValues.className = "danger";
      if (selected) {
        selected.className = null;
      }
      view.update(data);
    }

    this.selected = values;
  };

  delete = (e: { values: DataRow }) => {
    const rowValues = e.values;
    const index = this.data.indexOf(rowValues);
    this.data.splice(index, 1);
    this.view.removeAt(index);
  };

  private appendRows(count: number) {
    let { counter, view, data } = this;
    const offset = data.length;
    for (let i = offset, len = offset + count; i < len; i++) {
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

    view.update(data);
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
    const { view, data } = this;

    for (let i = 0; i < data.length; i += 10) {
      data[i].label += " !!!";
    }
    view.update(data);
  };
  clear = (): void => {
    this.view.clear();
    this.selected = null;
    this.data.length = 0;
  };
  swapRows = (): void => {
    const { data } = this;
    if (data.length > 4) {
      const tmp = data[1];
      data[1] = data[4];
      data[4] = tmp;
      this.view.move(1, 4);
      this.view.move(3, 1);
    }
  };
}

interface RowProps {
  select({ values: DataRow });
  delete({ values: DataRow });
}

function Row(props: RowProps) {
  const $ = useContext<DataRow>();

  return (
    <tr className={$(`className`)}>
      <td class="col-md-1">{$("id")}</td>
      <td class="col-md-4">
        <a class="lbl" click={props.select}>
          {$("label")}
        </a>
      </td>
      <td class="col-md-1">
        <a class="remove" click={props.delete}>
          <span
            class="remove glyphicon glyphicon-remove"
            aria-hidden="true"
          ></span>
        </a>
      </td>
      <td class="col-md-6"></td>
    </tr>
  );
}

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}
