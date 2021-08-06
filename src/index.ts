import { render, DomDriver } from "glow.js";
import { MenuCard } from "./app/menu-card";

render(new DomDriver("#app"), MenuCard());

