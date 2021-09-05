import tpl from "glow.js";
import { RouterComponent, ViewContext } from "mvc.js/router";
import { RouterPage } from "..";
import DatePicker from "../../components/date-picker";
import TextField from "../../components/text-field";

export function Employees(): RouterComponent {
  return {
    view(context: ViewContext) {
      return (
        <RouterPage>
          <div class="router-page__content">
            <header>Users</header>
            <main>
              <form class="form-group">
                <TextField label="Text" />
              </form>
              <DatePicker label="End date" />
            </main>
          </div>
        </RouterPage>
      );
    },
  };
}
