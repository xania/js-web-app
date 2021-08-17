import tpl from "../../../glow.js";
import svg from "./scan-me 2.svg";

export default function DemoComponent() {
  return {
    view() {
      return <img src={svg}></img>;
    },
  };
}
