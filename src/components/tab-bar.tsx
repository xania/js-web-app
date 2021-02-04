import tpl from "glow.js";

export default function TabBar() {
    return (
        <div class="mdc-tab-bar" role="tablist">
            <div class="mdc-tab-scroller">
                <div
                    class="mdc-tab-scroller__scroll-area mdc-tab-scroller__scroll-area--scroll"
                    style="margin-bottom: 0px;"
                >
                    <div class="mdc-tab-scroller__scroll-content">
                        <Tab title="Planning By Employee" />
                        <Tab title="Track Planning" />
                        <Tab title="Planning By Position" />
                        <Tab title="Demand Per Position" active={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}

interface TabProps {
    title: string;
    active?: boolean;
}
function Tab(props: TabProps) {
    var random = new Date().getTime();
    return (
        <button
            role="tab"
            class="mdc-tab"
            aria-selected="false"
            tabindex="-1"
            id={"tab_" + random}
        >
            <span class="mdc-tab__content">
                <span class="mdc-tab__text-label">{props.title}</span>
            </span>
            <span
                class={[
                    "mdc-tab-indicator",
                    props.active ? "mdc-tab-indicator--active" : null,
                ]}
            >
                <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
            </span>
            <span class="mdc-tab__ripple mdc-ripple-upgraded"></span>
        </button>
    );
}
