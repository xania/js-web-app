import { postJson, deleteJson, putJson, fetchJson } from "../../core";
import { Store, State } from "@xania/mutabl.js";
import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";

export interface Entity<T> {
  id: string;
  values: T;
  version: string;
}

export async function activeEntity<T>(path: string) {
  const url = path;
  let deleted = false;

  const entity = (await fetchJson(url)
    .then((e) => e.json())
    .catch((_) => {})) as Entity<T>;

  var store = new Store<T>(entity && entity.values);
  let version = entity && entity.version;
  return {
    get values(): State<T> {
      return store.asProxy();
    },
    reset(values: T) {
      store.update(values);
    },
    update: (values) =>
      !deleted
        ? putJson(url, { values, version }).then((resp) => resp.json())
        : Promise.resolve(null), // putDiff(url, store.value),
    save: () => postJson(url, store.value),
    delete: () =>
      deleteJson(url).then(() => {
        deleted = true;
      }),
    autoUpdate() {
      var subscr = new Rx.Observable(store.subscribe)
        .pipe(Ro.skip(1), Ro.debounceTime(1000), Ro.switchMap(this.update))
        .subscribe((entity) => {
          version = entity.version;
        });

      function onBeforeUnload(e) {
        this.update(store.value);
      }
      document.body.addEventListener("beforeunload", onBeforeUnload);

      return {
        unsubscribe: () => {
          subscr.unsubscribe();
          document.body.removeEventListener("beforeunload", onBeforeUnload);
          return this.update(store.value);
        },
      };
    },
  };
}
