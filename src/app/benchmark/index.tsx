import { TableStore, DataRow } from "./table-store";
import { createContainer, render, useContext } from "@xania/view";
import * as view from "@xania/view";
const jsx = view.jsx.createElement;

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

function App() {
  const rows = createContainer<DataRow>();
  const store = new TableStore(rows);
  return (
    <div id="main">
      <div class="container">
        <Jumbotron store={store} />
        <table class="table table-hover table-striped test-data">
          <tbody>{rows.map(<Row {...store} />)}</tbody>
        </table>
        <span
          class="preloadicon glyphicon glyphicon-remove"
          aria-hidden="true"
        ></span>
      </div>
    </div>
  );
}

interface RowProps {
  select({ node: Node });
  delete({ node: Node });
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

const main = document.getElementById("main");
render(<App />, main);
