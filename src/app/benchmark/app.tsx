import tpl, { render, createList } from "@xania/glow.js";
import { Store } from "@xania/mutabl.js";
import { RouterComponent } from "@xania/mvc.js/router";
import { TableStore, Row } from "./table-store";

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

interface RowProps {
  label: string;
  id: number;
}

export default function Benchmark(): RouterComponent {
  return <Container />;
}

function Container() {
  const rows = createList({ value: [] });
  var store = new TableStore(rows);
  return (
    <div class="container">
      <Jumbotron store={store} />
      <table class="table table-hover table-striped test-data">
        <tbody>
          {rows.map((row) => (
            <Row id={row.id} label={row.label} />
          ))}
        </tbody>
      </table>
      <span
        class="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      ></span>
    </div>
  );
}

function Row(props: RowProps) {
  return (
    <tr>
      <td class="col-md-1">{props.id}</td>
      <td class="col-md-4">
        <a class="lbl">{props.label}</a>
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
