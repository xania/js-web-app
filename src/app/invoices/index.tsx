import jsx from "@xania/glow.js";
import { RouterComponent, ViewContext } from "@xania/mvc.js/router";
import { RouterPage } from "..";
import Select from "../../components/select";
import TextField from "../../components/text-field";
import { activeEntity, Entity } from "./active-entity";
import { createList, List } from "@xania/glow.js/components";
import { fetchJson } from "../../core";
import { UrlHelper } from "../../../mvc.js/router/url-helper";
import {
  ListMutationType,
  pushItem,
} from "@xania/glow.js/components/list/list-mutation";
import { State } from "@xania/mutabl.js";

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
    return (invoice: State<Entity<Invoice>>) => (
      <div>
        <a class="router-link" href={url.stringify(invoice.id)}>
          {invoice.values.lift((v) => v.description || v.invoiceNumber)}
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

      const lines = createList(entity.values.declarations);

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
                    type: ListMutationType.REMOVE_AT,
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
                  change={(evt) => entity.values.date.update(evt.node["value"])}
                />
              </div>
              <hr />
              {lines.map(invoiceLineView)}
            </main>
          </div>
        </RouterPage>
      );
    },
  };

  function invoiceLineView(e: HourDeclaration) {
    return (
      <div>
        <TextField label="Description" value={e.description} />
        <TextField label="Hours" value={e.hours} parse={parseInt} />
      </div>
    );
  }
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
