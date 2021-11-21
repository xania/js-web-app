import tpl from "glow.js";
import "./style.scss";
import { MDCTextField } from "@material/textfield";
import { State } from "../../../mutabl.js";

interface TransformStreamDefaultControllerCallback<O> {
  (controller: TransformStreamDefaultController<O>): void | PromiseLike<void>;
}

interface KeyboardEventHandler {
  (ev: KeyboardEvent): void;
}
interface MouseEventHandler {
  (ev: MouseEvent): void;
}

interface InputEvents {
  keyup: KeyboardEventHandler;
  mouseup: MouseEventHandler;
}

interface TextFieldProps {
  label: string;
  value?: number | string | State<unknown>;
  readonly?: boolean;
  autofocus?: boolean;
  type?: "date" | "password";
  events?: Partial<InputEvents>;
  icon?: string;
  parse?(value: unknown);
}

export default function TextField(props: TextFieldProps) {
  const { value, parse } = props;
  return (
    <label
      class="mdc-text-field mdc-text-field--fullwidth mdc-text-field--filled mdc-text-field--with-trailing-icon"
      {...props.events}
    >
      <span class="mdc-text-field__ripple"></span>

      <span id="label" class="mdc-floating-label">
        {props.label}
      </span>

      <input
        aria-labelledby="label"
        class="mdc-text-field__input"
        type={props.type || "text"}
        value={value}
        keyup={defaultUpdate}
        change={defaultUpdate}
      />

      {props.icon && (
        <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing">
          event
        </i>
      )}

      <span class="mdc-line-ripple"></span>
      {MDCTextField}
    </label>
  );

  function defaultUpdate(e) {
    if (typeof value === "object" && "update" in value) {
      value.update(
        typeof parse === "function" ? parse(e.target.value) : e.target.value
      );
    }
  }
}

// export function Input(props: InputProps) {
//     const { label, readonly, value, autofocus, type, ...css } = props || {
//         readonly: false,
//         label: "",
//         css: "",
//         autofocus: false,
//         value: null,
//         type: "text",
//     };
//     const id = "__" + Math.random();
//     return (
//         <Fragment>
//             <div
//                 class={["mdc-text-field", "text-field", "mdc-ripple-upgraded"]}
//                 {...css}
//             >
//                 <input
//                     type={props.type}
//                     autofocus={autofocus}
//                     readonly={readonly}
//                     id={id}
//                     class="mdc-text-field__input"
//                     value={value}
//                     keyup={update}
//                     change={update}
//                 />
//                 <label class="mdc-floating-label" for={id}>
//                     {label}
//                 </label>
//                 <div class="mdc-line-ripple" />
//                 {MDCRipple}
//                 {MDCTextField}
//             </div>
//             <p
//                 class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg"
//                 id={id + "_helper_text"}
//             ></p>
//         </Fragment>
//     );

//     function update(e) {
//         if (value && value.update) {
//             value.update(e.target.value);
//         }
//     }
// }
