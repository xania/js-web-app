import { postJson } from "../../../core";
import { Order } from "./order";

interface CheckoutOptions {
  name: string;
  orders: Order[];
}
export enum OrderTarget {
  Kitchen,
  Bar,
}

export async function checkout(options: CheckoutOptions) {
  const { orders, name } = options;

  await postReceipt(OrderTarget.Kitchen, orders);

  function postReceipt(target: OrderTarget, orders: Order[]) {
    if (!(orders instanceof Array) || orders.length === 0)
      return Promise.resolve();
    const receipt = {
      isActive: true,
      date: new Date(),
      target: target.toString(),
      tafelId: name,
      waiterName: "menu",
      orders,
    };

    return postJson("/api/data/jennah/receipt", receipt);
  }
}
