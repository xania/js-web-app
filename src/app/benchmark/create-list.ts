import { Template } from "@xania/glow.js/lib/jsx/template";
import * as jsx from "@xania/glow.js/lib/jsx";
import {
  ListMutation,
  ListMutationManager,
  ListMutationType,
} from "@xania/glow.js";
import { flatTree } from "@xania/glow.js/lib/tpl";

export function createList<T>() {
  const mutations = new ListMutationManager<T>();
  return {
    map(itemTemplate: Template) {
      return {
        render({ target }) {
          const subscr = mutations.subscribe(
            createMutationsObserver<T>(target, itemTemplate)
          );
          return {
            dispose() {
              subscr.unsubscribe();
            },
          };
        },
      };
    },
    add(mut: ListMutation<T>) {
      mutations.pushMutation(mut);
    },
  };
}

function createMutationsObserver<T>(target: Element, template: Template) {
  const disposables: any[] = [];
  return {
    next(mut: ListMutation<T>) {
      const { type } = mut;
      switch (type) {
        case ListMutationType.PUSH:
          disposables.push(jsx.render(target, template, mut.values));
          break;
        case ListMutationType.CLEAR:
          flatTree(disposables, (d) => d.dispose());
          disposables.length = 0;
          break;
      }
    },
  };
}
