import * as glow from "@xania/glow.js";
import { RouterComponent } from "@xania/mvc.js/router";
import { TableStore, DataRow } from "./table-store";
import * as jsx from "@xania/glow.js/lib/jsx/index";
import { factory as tpl } from "@xania/glow.js/lib/jsx/index";
import * as Rx from "rxjs";
import { createList, RowContext } from "@xania/glow.js/lib/jsx/create-list";

import "./css/currentStyle.css";

interface JumbotronProps {
  store: TableStore;
}

function Jumbotron(props: JumbotronProps) {
  const { store } = props;
  return (
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>XaniaJS-"keyed"</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-6 smallpad">
              <button
                click={store.create1000Rows}
                type="button"
                class="btn btn-primary btn-block"
                id="run"
              >
                Create 1,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                click={store.create10000Rows}
                type="button"
                class="btn btn-primary btn-block"
                id="runlots"
              >
                Create 10,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                click={store.append1000Rows}
                type="button"
                class="btn btn-primary btn-block"
                id="add"
              >
                Append 1,000 rows
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                click={store.updateEvery10thRow}
                type="button"
                class="btn btn-primary btn-block"
                id="update"
              >
                Update every 10th row
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                click={store.clear}
                type="button"
                class="btn btn-primary btn-block"
                id="clear"
              >
                Clear
              </button>
            </div>
            <div class="col-sm-6 smallpad">
              <button
                click={store.swapRows}
                type="button"
                class="btn btn-primary btn-block"
                id="swaprows"
              >
                Swap Rows
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Benchmark(): RouterComponent {
  return {
    view: Adapter(),
  };
}

function Adapter() {
  return {
    render(driver: glow.DomDriver) {
      const { target } = driver as any;
      jsx.render(target, <Container />);
    },
  };
}

function Container() {
  const rows = createList<DataRow>();
  const store = new TableStore(rows);
  return (
    <div id="main">
      <div class="container">
        <Jumbotron store={store} />
        <table class="table table-hover table-striped test-data">
          <tbody>{rows.map((context) => Row(context, store.select))}</tbody>
        </table>
        <span
          class="preloadicon glyphicon glyphicon-remove"
          aria-hidden="true"
        ></span>
      </div>
    </div>
  );
}

function Row(context: RowContext<DataRow>, select: (row: DataRow) => any) {
  return (
    <tr class={context.property("className")} data_id={context.property("id")}>
      <td class="col-md-1">{context.property("id")}</td>
      <td class="col-md-4">
        <a class="lbl">{context.property("label")}</a>
      </td>
      <td class="col-md-1">
        <a class="remove">
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

// interface InputProps<T> {
//   value: State<T>;
// }

// function Input<T>(props: InputProps<T>) {
//   const tpl = jsx.factory;
//   const { value } = props;
//   return <input value={value} keyup={onKeyUp} />;

//   function onKeyUp({ target }) {
//     value.update(target.value);
//   }
// }
