import tpl from "glow.js";
import { RouterComponent, ViewContext } from "mvc.js/router";
import { RouterPage } from "..";
import { Store, asListStore as asListStore, pushItem, State } from "mutabl.js";
import Select from "../../components/select";
import TextField from "../../components/text-field";
import { activeEntity, Entity } from "./active-entity";
import { List } from "glow.js/components";
import { fetchJson } from "../../core";
import { UrlHelper } from "../../../mvc.js/router/url-helper";

const rider = { label: "Rider International", value: "rider" };
const alfa = { label: "Alfa Pro IT", value: "alfa" };
const partech = { label: "Partech IT BV", value: "partech" };
const r2group = { label: "R2 Group B.V.", value: "r2group" };

export function Invoices(): RouterComponent {
  return {
    routes: [
      {
        path: [":id"],
        component: InvoiceComponent,
      },
    ],
    async view(context: ViewContext) {
      const invoices: Entity<Invoice>[] = await fetchJson("/api/invoice").then(
        (e) => e.json()
      );
      return (
        <RouterPage>
          <div class="router-page__content">
            <header>Invoices</header>
            <main>
              <List source={invoices}>{invoiceListItem(context.url)}</List>
            </main>
          </div>
        </RouterPage>
      );
    },
  };

  function invoiceListItem(url: UrlHelper) {
    return (invoice: Entity<Invoice>) => (
      <div>
        <a class="router-link" href={url.stringify(invoice.id)}>
          {invoice.values.description}
        </a>
      </div>
    );
  }
}
export function InvoiceComponent(): RouterComponent {
  return {
    async view(context: ViewContext) {
      const { id } = context.params;
      var entity = await activeEntity<Invoice>("/api/invoice/" + id);

      const lines = asListStore<HourDeclaration>(entity.values.declarations);

      return (
        <RouterPage>
          {entity.autoUpdate()}
          <div class="router-page__content">
            <header>
              Factuur <span>{entity.values.invoiceNumber}</span>
              <a href={`/api/invoice/${id}/pdf`}>download</a>
              <button
                click={() =>
                  lines.add(
                    pushItem({
                      hours: lines.length,
                      description: `invoice line ${lines.length + 1}`,
                    })
                  )
                }
              >
                add
              </button>
              <button
                click={() =>
                  lines.add({
                    type: "remove",
                    index: lines.length - 1,
                  })
                }
              >
                remove
              </button>
            </header>

            <main>
              <div>
                <TextField
                  label="Invoice number"
                  value={entity.values.invoiceNumber}
                ></TextField>
              </div>
              <div>
                <TextField
                  label="Description"
                  value={entity.values.description}
                ></TextField>
              </div>
              <div>
                <TextField
                  label="Owner"
                  value={entity.values.owner}
                ></TextField>
              </div>
              <div>
                <Select
                  options={[r2group, rider, alfa, partech]}
                  label="Company"
                  value={entity.values.companyId}
                ></Select>
              </div>
              <div>
                <input
                  type="date"
                  value={entity.values.date}
                  change={(evt) => entity.values.date.update(evt.target.value)}
                />
              </div>
              <hr />
              <List source={lines}>{invoiceLineView}</List>
            </main>
          </div>
        </RouterPage>
      );
    },
  };

  function invoiceLineView(e: InvoiceLine) {
    return (
      <div>
        <TextField label="Description" value={e.description} />
        <TextField label="Hours" value={e.hours} parse={parseInt} />
      </div>
    );
  }
}

interface InvoiceLine {
  description: string;
  hours: string;
}
interface Invoice {
  invoiceNumber: string;
  description: string;
  owner: string;
  companyId: string;
  date: string;
  declarations: HourDeclaration[];
}

interface HourDeclaration {
  hours: number;
  description: string;
}
