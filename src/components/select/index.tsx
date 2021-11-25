import tpl from "@xania/glow.js";
import { State } from "../../../mutabl.js";
import { MDCSelect } from "@material/select";
import { MDCRipple } from "@material/ripple";
import { Attr } from "../../../glow.js/components/css";

type SelectProps<T> = {
  label: string;
  value: State<T>;
  options: SelectOption<T>[];
};

type SelectOption<T> = {
  value: T;
  label: string;
};

export default function Select<T>(props: SelectProps<T>) {
  const id = new Date().getTime();
  return [
    <div class="mdc-select mdc-ripple-upgraded" style="display: block;">
      <i class="mdc-select__dropdown-icon"></i>
      <select
        change={onChange}
        id={id}
        class="mdc-select__native-control"
        value={props.value}
      >
        <option value=""></option>
        {props.options.map((e) => (
          <option value={e.value}>{e.label}</option>
        ))}
        <Attr name="value" value={props.value} />
      </select>
      <label
        for={id}
        class="mdc-floating-label mdc-floating-label--float-above"
      >
        {props.label}
      </label>
      <div class="mdc-line-ripple"></div>
    </div>,
    MDCRipple,
    <p
      class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg"
      id={id + "_helper_text"}
    ></p>,
  ];

  function onChange(evt) {
    props.value.update(evt.target.value);
  }
}
