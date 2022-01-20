import { tpl as jsx } from "@xania/glow.js";
import { IActionContext, IAction } from "@xania/mvc.js";
import { Fragment } from "@xania/glow.js/lib/fragment";
import { RouterOutlet } from "@xania/mvc.js/outlet";
import { MDCList } from "@material/list";
import { MDCDrawer } from "@material/drawer";
import { MDCTopAppBar } from "@material/top-app-bar";
import { DomDriver, isDomNode } from "@xania/glow.js/lib/dom";
import { Login } from "../login";
import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";
import { LinkListener } from "@xania/mvc.js/router/link";
import {
  createBrowser,
  createRouter,
  RouteInput,
  RouterComponent,
  ViewContext,
} from "@xania/mvc.js/router";

import "./style.scss";
import { Invoices } from "./invoices/index";
import { UrlHelper } from "../../mvc.js/router/url-helper";
import { MainMenuCard } from "./jennah/menu-card/main";
import DemoComponent from "./jennah/demo";
import Benchmark from "./benchmark/app";
import * as view from "@xania/view";
import * as demo from "./demo";

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
  url: UrlHelper;
}
function Aside(props: AsideProps) {
  const { url } = props;
  return (
    <aside
      class={[
        "mdc-drawer mdc-drawer--modal mdc-top-app-bar--fixed-adjust",
        props.open ? "mdc-drawer--open" : null,
      ]}
    >
      <div class="mdc-drawer__content">
        <nav class="mdc-list" tabIndex={0}>
          <hr class="mdc-list-divider" />
          <MainLink
            text="Employees"
            url={url.stringify("employees")}
            icon="group"
            color="darkgreen"
          />
          <MainLink
            text="Invoices"
            url={url.stringify("invoices")}
            icon="domain"
          />
          <MainLink
            text="Agents Planning"
            url={url.stringify("agents-planning")}
            icon="schedule"
            color="black"
          />
          <MainLink
            text="Assign card to agent"
            url={url.stringify("card-assignment")}
            icon="credit_card"
          />
          <MainLink
            text="Settings"
            url={url.stringify("settings")}
            icon="settings"
          />
          <MainLink
            text="Administration"
            url={url.stringify("security")}
            icon="security"
            color="red"
          />
          <hr class="mdc-list-divider" />
          {MDCList}
        </nav>
      </div>
    </aside>
  );
}

export function RouterPage(props, children: any) {
  return <section class="router-page">{children}</section>;
}

function adminRoutes() {
  return [
    {
      path: ["invoices"],
      component: Invoices,
    },
  ];
}
``;
export default function App() {
  const browser = createBrowser([]);
  const router = createRouter(browser, browser.routes, [
    { path: [], component: MainMenuCard },
    { path: ["admin"], component: AdminComponent },
    { path: ["jennah", "demo"], component: DemoComponent },
    {
      path: ["benchmark"],
      component: Benchmark,
    },
    {
      path: ["demo"],
      component: () => Adapter(<demo.App />),
    },
  ]);
  return (
    <Fragment>
      <LinkListener />
      <RouterOutlet router={router} />
    </Fragment>
  );
}

function Adapter(template: JSX.Element): RouterComponent {
  return {
    view: {
      render(driver: DomDriver) {
        const { target } = driver as any;
        view.render(target, template);
      },
    },
  };
}

function AdminComponent() {
  return {
    view(context: ViewContext) {
      return (
        <Fragment>
          <LinkListener />
          <Aside open={location.pathname == "/admin"} url={context.url} />
          <div class="mdc-drawer-scrim"></div>
          <div class="mdc-drawer-app-content" style="height: 100%;">
            <TopBar />
            <main class="main-content mdc-top-app-bar--fixed-adjust router-outlet-container">
              <RouterOutlet router={context.childRouter(adminRoutes())} />
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
                container.removeEventListener("click", onContainerClick);
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
    },
  };
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
      <main style="color: red;">NOT FOUND {context.url.path.join("/")}</main>
    </div>
  );
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
  color?: string;
}
function MainLink(props: MainLinkProps) {
  return (
    <a class="mdc-list-item router-link" href={props.url} aria-current="page">
      <i
        class="material-icons mdc-list-item__graphic"
        style={props.color && "color: " + props.color}
        aria-hidden="true"
      >
        {props.icon}
      </i>
      <span class="mdc-list-item__text">{props.text}</span>
    </a>
  );
}

function input(name: string, value: string) {
  return {
    name,
    value,
    blur(e) {},
  };
}

interface ControlProps {
  name: string;
  value: string;
}
function Control(props: ControlProps) {
  return (
    <input style="border: 2px solid blue;" {...input(props.name, props.value)}>
      box
    </input>
  );
}

interface ToggleButtonProps {}
function ToggleButton(props: ToggleButtonProps) {
  return <a class="mdc-button mdc-button--outline">toggle</a>;
}
