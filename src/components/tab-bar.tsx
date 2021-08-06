import tpl from "glow.js";
import * as Rx from "rxjs";
import { Expression } from "../../mutabl.js/lib/observable";

interface TabBarProps {
    selected: Expression<string[]>;
}
export default function TabBar(props: TabBarProps) {
    const { selected } = props || {};
    return (
        <div class="mdc-tab-bar" role="tablist">
            <div class="mdc-tab-scroller">
                <div
                    class="mdc-tab-scroller__scroll-area mdc-tab-scroller__scroll-area--scroll"
                    style="margin-bottom: 0px;"
                >
                    <div
                        class="mdc-tab-scroller__scroll-content"
                        style="padding: 10px;"
                    >
                        <Tab
                            title="Planning By Employee"
                            url="/agents-plannig"
                            active={selected.lift((s) => s.length === 0)}
                        />
                        <Tab
                            title="Track Planning"
                            url="/agents-plannig/tracks"
                            active={selected.lift((s) => s[0] === "tracks")}
                        />
                        <Tab
                            title="Planning By Position"
                            url="/agents-plannig/per-position"
                            active={selected.lift(
                                (s) => s[0] === "per-position"
                            )}
                        />
                        <Tab
                            title="Demand Per Position"
                            url="/agents-plannig/demands"
                            active={selected.lift((s) => s[0] === "demands")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

interface TabProps {
    title: string;
    active?: Expression<boolean>;
    url?: string;
}
function Tab(props: TabProps) {
    var random = new Date().getTime();
    return (
        <a
            role="tab"
            class="router-link mdc-tab"
            aria-selected="false"
            tabindex="-1"
            id={"tab_" + random}
            href={props.url}
        >
            <span class="mdc-tab__content">
                <span class="mdc-tab__text-label">{props.title}</span>
            </span>
            <span
                class={[
                    "mdc-tab-indicator",
                    props.active
                        ? props.active.lift(
                              (b) => b && "mdc-tab-indicator--active"
                          )
                        : null,
                ]}
            >
                <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
            </span>
            <span class="mdc-tab__ripple mdc-ripple-upgraded"></span>
        </a>
    );
}
