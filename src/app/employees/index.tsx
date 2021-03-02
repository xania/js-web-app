import tpl from "glow.js";
import { Component, ViewContext } from "mvc.js/router";
import { RouterPage } from "..";

export function Employees(): Component {
    return {
        view(context: ViewContext) {
            return (
                <RouterPage>
                    <div class="router-page__content">
                        <header style="max-width: 900px;">Users</header>
                    </div>
                </RouterPage>
            );
        },
    };
}
