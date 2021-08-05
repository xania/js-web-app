import tpl from "glow.js";
import { Component, ViewContext } from "mvc.js/router";
import { RouterPage } from "..";
import { Store, asListSource, pushItem, State } from "mutabl.js";
import Select from "../../components/select";
import TextField from "../../components/text-field";
import { activeEntity } from "./active-data";
import { List } from "glow.js/components";

const rider = { label: "Rider International", value: "rider" };
const alfa = { label: "Alfa Pro IT", value: "alfa" };
const partech = { label: "Partech IT BV", value: "partech" };
const r2group = { label: "R2 Group B.V.", value: "r2group" };

export function Invoices(): Component {
    var store = new Store({
        lines: [1, 2, 3],
    });
    return {
        async view(context: ViewContext) {
            var entity = await activeEntity<Invoice>(
                "/api/invoice/4b95543d-080a-4da2-979b-0b958deff264"
            );

            const lines = asListSource(entity.values.lines);

            return (
                <RouterPage>
                    {entity.autoUpdate()}
                    <div class="router-page__content">
                        <header>
                            Factuur <span>{entity.values.invoiceNumber}</span>
                            <button
                                click={() =>
                                    lines.add(
                                        pushItem({
                                            description: `invoice line ${lines.length +
                                                1}`,
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
                                        predicate: lines.length - 1,
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
                                    value={entity.values.company}
                                ></Select>
                            </div>
                            <div>
                                <input
                                    type="date"
                                    value={entity.values.date}
                                    change={(evt) =>
                                        entity.values.date.update(
                                            evt.target.value
                                        )
                                    }
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
                {e.description}
            </div>
        );
    }
}

interface InvoiceLine {
    description: string;
}
interface Invoice {
    invoiceNumber: string;
    description: string;
    owner: string;
    company: string;
    date: string;
    lines: InvoiceLine[];
}
