import { render, DomDriver } from "@xania/glow.js";
import App from "./app";

render(new DomDriver("#app"), App());
