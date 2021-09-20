import { render, DomDriver } from "glow.js";
import App from "./app";

render(new DomDriver("#app"), App());
