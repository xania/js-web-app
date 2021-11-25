import tpl from "@xania/glow.js";
import { MDCTextField } from "@material/textfield";

interface LoginProps {
  click(): any;
}
export function Login(props: LoginProps) {
  const { click } = props;
  return (
    <div class="login-card-container">
      <section class="login-card mdc-elevation--z3">
        <main>
          <div style="margin: 16px 0;">
            <Input label="User" />
          </div>
          <div style="margin: 16px 0;">
            <Input label="Password" />
          </div>
        </main>
        <div class="login-card-toolbar">
          <a tabindex="-1" href="./forgot" class="forgot-password">
            {/* forgot password */}
          </a>
          <button
            click={click}
            class="mdc-button--raised mdc-ripple-upgraded mdc-button"
          >
            <span class="mdc-button__label">Login</span>
          </button>
        </div>
      </section>
    </div>
  );
}

interface InputProps {
  label?: string;
}

function Input(props: InputProps) {
  const { label = "Unnamed" } = props || {};
  const id = "_" + new Date().getTime();
  return (
    <div class="mdc-text-field" style="width: 100%;">
      <input class="mdc-text-field__input" id={id} />
      <div class="mdc-line-ripple"></div>
      <label for={id} class="mdc-floating-label">
        {label}
      </label>
      {MDCTextField}
    </div>
  );
}
