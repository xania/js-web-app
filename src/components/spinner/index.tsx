import tpl from "glow.js";
import "./style.scss";

export default function Spinner() {
    return (
        <div
            class="loader-spinner"
            style="text-align: center; height: 100%; max-height: 400px; display: absolute"
        ></div>
    );
}
