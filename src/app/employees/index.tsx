import tpl from "glow.js";
import { Component, ViewContext } from "mvc.js/router";
import { RouterPage } from "..";
import DatePicker from "../../components/date-picker";
import TextField from "../../components/text-field";

export function Employees(): Component {
    return {
        view(context: ViewContext) {
            return (
                <RouterPage>
                    <div class="router-page__content">
                        <header>Users</header>
                        <main>
                            <form class="form-group">
                                <TextField label="Text" value="" />
                            </form>
                            <DatePicker label="End date" />
                        </main>
                    </div>
                </RouterPage>
            );
        },
    };
}
