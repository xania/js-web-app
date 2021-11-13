import { IDriver } from "glow.js";
import { Expression, ListMutation } from "mutabl.js";
import { Order } from "./order";

interface SummaryOptions {
  orders: Expression<Order[]>;
}

export function ShoppingCartSummary(options: SummaryOptions) {
  return {
    render(driver: IDriver) {
      const binding = driver.createNative("0");
      const { orders } = options;
      const subsr = orders.subscribe({
        next(orders: Order[]) {
          let count = orders.reduce((prev, next) => next.count + prev, 0);
          binding.next(count);
          console.log(count);
        },
      });

      return [subsr, binding];
    },
  };
}
