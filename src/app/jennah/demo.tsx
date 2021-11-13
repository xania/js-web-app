import { Fragment } from "glow.js/lib/fragment";
import tpl from "../../../glow.js";

export default function DemoComponent() {
  return {
    view() {
      return <Product id="2"></Product>;
    },
  };
}

interface ProductOptions {
  id: string;
}

async function Product(options: ProductOptions) {
  var todo = await fetch(
    "https://jsonplaceholder.typicode.com/todos/" + options.id
  ).then((response) => response.json());
  return (
    <Fragment>
      <div>userId: {todo.userId}</div>
      <div>title: {todo.title}</div>
      <div>completed: {todo.completed ? "true" : "false"}</div>
    </Fragment>
  );
}
