import { render, DomDriver } from "glow.js";
import App from "./app";
import "./watcher";

render(new DomDriver("#app"), App());
