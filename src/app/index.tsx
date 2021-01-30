import { tpl, init, render, disposeMany } from "glow.js";
import { IActionContext, IAction } from "mvc.js";
import { Fragment } from "glow.js/lib/fragment";
import { RouterOutlet } from "mvc.js/outlet";
import { MDCRipple } from "@material/ripple";
import { MDCList } from "@material/list";
import { MDCDrawer } from "@material/drawer";
import { MDCTopAppBar } from "@material/top-app-bar";
import { isDomNode } from "glow.js/lib/dom";
import { Login } from "../login";
import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";
import { LinkListener } from "mvc.js/router/link";
import { RouteInput, ViewContext } from "mvc.js/router";
import "./style.scss";

function TopBar() {
    return (
        <header class="mdc-top-app-bar app-bar" id="app-bar">
            <div class="mdc-top-app-bar__row">
                <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                    <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">
                        menu
                    </button>
                    <span class="mdc-top-app-bar__title">
                        Real-time Operation Management
                    </span>
                </section>
                <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
                    <button
                        class="mdc-icon-button material-icons mdc-top-app-bar__action-item mdc-ripple-upgraded--unbounded mdc-ripple-upgraded"
                        aria-label="Download"
                        style="--mdc-ripple-fg-size:28px; --mdc-ripple-fg-scale:1.71418; --mdc-ripple-left:10px; --mdc-ripple-top:10px;"
                    >
                        search
                    </button>
                    <button
                        class="mdc-icon-button material-icons mdc-top-app-bar__action-item mdc-ripple-upgraded--unbounded mdc-ripple-upgraded"
                        aria-label="Download"
                        style="--mdc-ripple-fg-size:28px; --mdc-ripple-fg-scale:1.71418; --mdc-ripple-left:10px; --mdc-ripple-top:10px;"
                    >
                        add
                    </button>
                </section>
            </div>
        </header>
    );
}

interface AsideProps {
    open: boolean;
}
function Aside(props: AsideProps) {
    return (
        <aside
            class={[
                "mdc-drawer mdc-drawer--modal mdc-top-app-bar--fixed-adjust",
                props.open ? "mdc-drawer--open" : null,
            ]}
        >
            <div class="mdc-drawer__header">
                <h3 class="mdc-drawer__title">Mail</h3>
                <h6 class="mdc-drawer__subtitle">email@material.io</h6>
            </div>
            <div class="mdc-drawer__content">
                <nav class="mdc-list" tabindex="0">
                    <MainLink text="Login" url="/login" icon="inbox" />
                    <MainLink text="Inbox" url="/" icon="inbox" />
                    <hr class="mdc-list-divider" />
                    <h6 class="mdc-list-group__subheader">Labels</h6>
                    <MainLink text="Outgoing" url="/test" icon="send" />
                    {MDCList}
                </nav>
            </div>
        </aside>
    );
}

function RouterPage() {
    return (view: (context: ViewContext) => any, context: ViewContext) => (
        <section class="router-page">
            {view ? view(context) : notFound(context)}
        </section>
    );
}

export default function App() {
    return (
        <Fragment>
            <LinkListener />
            <Aside open={location.pathname == "/"} />
            <div class="mdc-drawer-scrim"></div>
            <div class="mdc-drawer-app-content" style="height: 100%;">
                <TopBar />
                <main class="main-content mdc-top-app-bar--fixed-adjust">
                    <RouterOutlet
                        routes={[{ path: ["test"], component: test }]}
                    >
                        <RouterPage />
                    </RouterOutlet>
                </main>
            </div>
            <Drawer />
        </Fragment>
    );

    function Drawer() {
        return {
            attachTo(container: HTMLElement) {
                const drawer = MDCDrawer.attachTo(
                    container.querySelector(".mdc-drawer")
                );
                const topAppBar = MDCTopAppBar.attachTo(
                    container.querySelector(".mdc-top-app-bar")
                );
                const mainContentEl = document.querySelector(".main-content");
                topAppBar.setScrollTarget(mainContentEl);
                topAppBar.listen("MDCTopAppBar:nav", () => {
                    drawer.open = !drawer.open;
                });

                container.addEventListener("MDCDrawer:closed", () => {
                    const elt = mainContentEl.querySelector("input, button");
                    if (isDomNode(elt)) {
                        elt.focus();
                    }
                });
                container.addEventListener("click", onContainerClick);
                return {
                    dispose() {
                        container.removeEventListener(
                            "click",
                            onContainerClick
                        );
                    },
                };
                function onContainerClick(e: MouseEvent) {
                    const { target } = e;
                    if (isDomNode(target)) {
                        if (target.classList.contains("router-link")) {
                            drawer.open = false;
                        }
                    }
                }
            },
        };
    }
}

function login() {
    return {
        execute() {
            return (
                <div>
                    <Login click={() => {}} />
                </div>
            );
        },
    };
}

function notFound(context: ViewContext) {
    return (
        <div class="router-page__content">
            <main style="color: red;">
                NOT FOUND {context.url.path.join("/")}
            </main>
        </div>
    );
}

function test(): Action {
    return {
        view(context: ViewContext) {
            const { parent } = context.url;
            return (
                <Fragment>
                    <div class="router-page__content">
                        <header>test action</header>
                        <main>
                            <div>
                                asdfas asdf asdf asdf asdf asdf asdfas
                                dfasdfasdfa sdf asdfasdfa sdfasdf
                            </div>
                            {parent && <div>{parent.route()}</div>}
                            <a
                                href={context.url.route("test")}
                                // click={context.url.relative("bla")}
                                class="mdc-button mdc-button--raised router-link"
                            >
                                {MDCRipple}
                                <div class="mdc-button__ripple"></div>
                                <span class="mdc-button__label">Button</span>
                            </a>
                        </main>
                    </div>
                </Fragment>
            );
        },
        routes: [{ path: ["test"], component: test }],
    };
}

function authorized(action: IAction<any>) {
    return {
        execute(context: IActionContext) {
            const subject = new Rx.Subject();
            return subject.pipe(
                Ro.startWith(
                    <div class="router-page__content">
                        <Login click={onLogin} />
                    </div>
                )
            );

            function onLogin() {
                subject.next(action.execute(context));
            }
        },
        resolve: action.resolve,
    };
}

interface Action {
    view(context: ViewContext): any;
    routes?: RouteInput<any>[];
}

interface MainLinkProps {
    text: string;
    url: string;
    icon: string;
}
function MainLink(props: MainLinkProps) {
    return (
        <a
            class="mdc-list-item router-link"
            href={props.url}
            aria-current="page"
        >
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                {props.icon}
            </i>
            <span class="mdc-list-item__text">{props.text}</span>
        </a>
    );
}
