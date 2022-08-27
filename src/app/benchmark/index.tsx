import { TableStore } from "./table-store";
import { render } from "@xania/view";
import { createElement as jsx } from "@xania/view";

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
          <button click={store.run}>run</button>
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
  const store = new TableStore();
  return (
    <div id="main">
      <div class="container">
        <Jumbotron store={store} />
        <table class="table table-hover table-striped test-data">
          <tbody>{store.view}</tbody>
        </table>
        <span
          class="preloadicon glyphicon glyphicon-remove"
          aria-hidden="true"
        ></span>
      </div>
    </div>
  );
}

const main = document.getElementById("main");
render(<App />, main);
