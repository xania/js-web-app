import tpl from "glow.js";
import { Component, ViewContext } from "mvc.js/router";
import { RouterPage } from "..";
import { Store } from "../../../mutabl.js";
import TextField from "../../components/text-field";
import { fetchJson } from "../../core";

export function Invoices(): Component {
    var store = new Store({
        lines: [],
    });
    return {
        async view(context: ViewContext) {
            var invoice = await activeData("/api/data/invoice");
            console.log(invoice);
            return (
                <RouterPage>
                    <div class="router-page__content">
                        <header>Invoices</header>
                        <main>
                            <div>
                                <TextField label="Invoice number"></TextField>
                            </div>
                            <div>
                                <TextField label="Description"></TextField>
                            </div>
                            <div>
                                <TextField label="Owner"></TextField>
                            </div>
                            <div>
                                <TextField label="Company"></TextField>
                            </div>
                            <div>
                                <TextField label="Date" type="date"></TextField>
                            </div>
                        </main>
                    </div>
                </RouterPage>
            );
        },
    };
}

async function activeData(url: string) {
    return fetchJson(url);
}
