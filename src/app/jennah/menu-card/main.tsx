import { tpl } from "glow.js";
import { Fragment } from "glow.js/lib/fragment";
import Css from "glow.js/components/css";
import "./menu-card.scss";
import { ViewContext } from "mvc.js/router";
import { createList } from "glow.js/components";
import TextField from "../../../components/text-field";
import { Order, OrderOption } from "./order";
import { checkout } from "./checkout";
import { ShoppingCartSummary } from "./shopping-cart-summary";
import { pushItem, removeItem } from "glow.js/components/list/list-mutation";
import { State, Store } from "mutabl.js";

function option(title: string): ProductOption {
  return {
    type: "option",
    title,
  };
}

const friet: Product = {
  title: "Friet",
  price: 2.5,
};

const huisfriet: Product = {
  title: "Huis friet",
  price: 3,
};

function choice(title: string, products: Product[]): ProductChoice {
  return {
    type: "choice",
    title,
    products,
  };
}

const colddrinks = [
  { title: "Cola", price: 2.5 },
  { title: "Fanta", price: 2.5 },
  { title: "Sprite", price: 2.5 },
  { title: "Bitter Lemon", price: 2.5 },
  { title: "Spa", price: 2.5 },
  { title: "Ginger Ale", price: 2.5 },
  { title: "Ice Tea", price: 2.5 },
  { title: "Red bull", price: 3 },
];

const hotdrinks = {
  pickwick: { title: "Pickwick thee", price: 2.5 },
  munt: {
    glas: { title: "Theeglas", price: 2.5 },
    kleinpot: { title: "Klein theepot", price: 3.5 },
    grootpot: { title: "Theepot", price: 4.5 },
  },
  chocomel: { title: "Chocomel", price: 2.5 },
  koffie: { title: "Koffie", price: 2.5 },
  cappuccino: { title: "Cappuccino", price: 3 },
  verkeerd: { title: "Koffieverkeerd", price: 3 },
  espresso: { title: "Espresso", price: 2.5 },
  latte: { title: "Cafe Late", price: 3 },
  machiatto: { title: "Cafe Machiatto", price: 3 },
};

const products = {
  starters: [
    {
      title: "Harira",
      price: 4.5,
      options: [],
      description: "Dadels, stukjes broodjes en citroen",
    },
    {
      title: "Bisara",
      price: 4.5,
      description: "gereserveerd met brood",
    },
    { title: "Loempia", price: 3.5 },
    {
      title: "Tortilla",
      price: 5.0,
      description: "spaanse tortilla met aardappelen en eieren",
    },
    // { title: "Nacho's", price: 7.5 },
  ],
  paninis: [
    {
      title: "Kip",
      price: 4.5,
    },
    {
      title: "Tuna",
      price: 4.5,
      options: [option("Olijven")],
    },
    {
      title: "Grillworst",
      price: 4.5,
    },
    {
      title: "Garnalen",
      price: 5,
    },
  ],
  sandwiches: [
    {
      title: "Kip (of hete kip)",
      price: 6.5,
      options: [
        option("Heet kip"),
        choice("Drank", discount(colddrinks, 1)),
        choice("Friet", discount([friet, huisfriet], 1)),
      ],
    },
    { title: "Kefta", price: 6.5, description: "kalfsgehakt" },
    // { title: "Kip tenders (van de grill)", price: 7.5 },
    { title: "Sossit / Merquez", price: 7 },
    { title: "Garnalen", price: 7.5 },
  ],
  burgers: [
    {
      title: "Jennah Burger",
      price: 10.5,
      description:
        "kalfsgehakt, cheddar kaas, spiegel-ei, gekarameliseerde uien en augurken",
    },
    {
      title: "Classic Cheese Burger",
      price: 9,
      description: "180g kalfsgehakt, cheddar kaas en gekarameliseerde uien",
    },
    {
      title: "Double Cheese Burger",
      price: 12.5,
      description: "360g kalfsgehakt, cheddar kaas en gekarameliseerde uien",
    },
    {
      title: "Kipfilet Burger",
      price: 8,
      description: "met kipfilet van de grill",
    },
    {
      title: "Kipgehakt Burger",
      price: 8,
      description: "kipgehakt, cheddar kaas en gekarameliseerde uien",
    },
  ],
  salads: [
    {
      title: "Tonijn Salade",
      price: 8,
      description: "met tonijn, olijven en mais",
    },
    {
      title: "Ceasar Salade",
      price: 9,
      description: "met kip van de grill, yoghurt dressing en parmezaanse kaas",
    },
    { title: "Zalm Salade", price: 9, description: "met zalm van de grill" },
    { title: "Garnalen Salade", price: 9 },
  ],
  colddrinks,
  tajines: [
    { title: "Tajine kip", price: 12.5 },
    { title: "Tajine Vlees", price: 14.5 },
    { title: "Tajine Pilpil", price: 14 },
    { title: "Tajine Kefta", price: 11 },
  ],
  couscous: [
    { title: "Vegie", price: 10 },
    { title: "Kip", price: 12 },
    { title: "Vlees", price: 13 },
    {
      title: "Royaal",
      price: 16.5,
      description: "met vlees en stukje kip, uien, rozijnen en kikkerwerten",
    },
  ],
  desserts: [
    {
      title: "Cheese cake",
      price: 5.5,
      description: "Informeer naar onze variaties",
    },
    { title: "Redvelvet", price: 5.5 },
    { title: "Worteltaart", price: 5.5 },
  ],
  grill: [
    { title: "Kip Filet", price: 13.5 },
    { title: "Kalfs Spies", price: 14 },
    { title: "Kip Sate", price: 13.5 },
    { title: "Mix Grill", price: 17.5 },
    { title: "Kefta Schotel", price: 13 },
    { title: "Zalm Schotel", price: 13 },
    { title: "Garnalen Schotel", price: 14 },
    { title: "Sausage / Merquez Schotel", price: 14 },
  ],
  pasta: [
    { title: "Kip", price: 12.5 },
    { title: "Garnalen en/of zalm", price: 13.5 },
    { title: "Bolognese", price: 13.5 },
    { title: "Arabiatta", price: 10 },
  ],
};

type PushOrderEventHandler = (o: Product, options?) => void;
interface MenuCallbacks {
  onSelect(product: Product);
}

function productViewFactory(product: Product, onSelect: PushOrderEventHandler) {
  return {
    view(context: ViewContext) {
      const selection: OrderOption[] = [];
      const { options } = product;
      return (
        <div class="product-detail">
          <header>
            {product.title}
            <a href="/" class="router-link close-button">
              &times;
            </a>
          </header>
          <div class="product-detail__content">
            {options.map((o) => optionView(o, selection))}
          </div>
          <button click={compose(onClick, context.url.parent.navigate)}>
            toevoegen
          </button>
        </div>
      );
      function onClick() {
        onSelect(product, [...selection]);
      }
    },
  };

  function optionView(o: ProductAddendum, selection: OrderOption[]) {
    if (o.type == "choice") {
      const { products } = o;
      return (
        <div>
          <select
            name={o.title}
            change={(e) => selection.push({ title: e.target.value, price: 1 })}
          >
            <option value="">[ Selecteer {o.title} ]</option>
            {products.map((p) => (
              <option value={p.title}>{p.title}</option>
            ))}
          </select>
        </div>
      );
    } else {
      const id = "checkbox_" + new Date().getTime();
      return (
        <div>
          <input type="checkbox" id={id} />
          <label for={id}>{o.title}</label>
        </div>
      );
    }
  }
}

export function MainMenuCard() {
  const store = new Store<{ orders: Order[] }>({
    orders: [],
  });
  const orders = store.property("orders");
  const ordersList = createList<Order>(orders);
  const allProducts: Product[] = [];
  for (const cat in products) {
    allProducts.push.apply(allProducts, products[cat]);
  }

  function pushOrder(product: Product, options: OrderOption[]) {
    const { title } = product;

    const item = ordersList.find(
      (o) => o.title === title && equalOrderOptions(o.options, options)
    );

    if (item) {
      item.update((order) => {
        order.count++;
      });
    } else {
      ordersList.add(
        pushItem<Order>({
          title: title,
          count: 1,
          options,
        })
      );
    }
  }

  function decrementOrder(order: State<Order>, index: () => number) {
    if (order.count > 1) {
      order.count.update((c) => c - 1);
    } else ordersList.add(removeItem(index()));
  }

  function incrementOrder(order: State<Order>) {
    order.count.update((c) => c + 1);
  }

  return {
    routes: allProducts.map((pr) => ({
      path: productPath(pr),
      component: productViewFactory(pr, pushOrder),
    })),
    view(context: ViewContext) {
      const events: ProductEvents = {
        onSelect(product: Product) {
          if (hasAny(product.options)) {
            context.url.navigate(...productPath(product));
          } else {
            pushOrder(product, []);
          }
        },
      };

      return (
        <Fragment>
          <Css value="jennah" />
          <div class="topbar">
            <h1>Restaurant & Cafe Jennah</h1>
            <span class="halal">100% Halal</span>
            <span class="topbar-wifi">
              <span class="material-icons">rss_feed</span>
              Jennah2021 |
              <span class="material-icons" style="color: #128C7E">
                whatsapp
              </span>
              +31 6 87120348
            </span>
          </div>
          <div class="order_cart">
            <ShoppingCartSummary orders={orders} />
          </div>
          <div class="menu-card">
            <Starters {...events} />
            <Sandwich {...events} />
            <Paninis {...events} />
            <Burgers {...events} />
            <Salad {...events} />
            <Traditional />
            <Pasta {...events} />
            <Grill {...events} />
            <Tajine {...events} />
            <Couscous {...events} />
            <Desserts {...events} />
            <ColdDrinks {...events} />
            <HotDrinks {...events} />
            {/* <div style="flex: 1; display: inline-flex">
          <img style="width: 100%; margin: auto 0 0 0" src={burgerSrc} />
        </div> */}
          </div>
          <div class="menu-card__order">
            <div style="text-align: center">
              <TextField label="Uw naam" />
            </div>
            {ordersList.map((order, { index }) => (
              <Fragment>
                <div class="menu-card__order-item">
                  <span class="menu-card__order-item__count">
                    {order.count}
                  </span>
                  &nbsp;
                  <span class="menu-card__order-item__text">{order.title}</span>
                  <span class="menu-card__order-item__buttons">
                    <a click={() => incrementOrder(order)}>
                      <span class="mdi mdi-chevron-up"></span>
                    </a>
                    <a
                      click={() => decrementOrder(order, index)}
                      class="button"
                    >
                      <span class="mdi mdi-chevron-down"></span>
                    </a>
                  </span>
                </div>
                {order.peek((o) => (
                  <div class="menu-card__order-option">
                    {o.options.map((entry) => (
                      <span style="margin: 0 2px;">{entry.title}</span>
                    ))}
                  </div>
                ))}
              </Fragment>
            ))}

            <div style="text-align: center">
              <button
                click={(_) => checkout({ orders: [], name: "klant" })}
                class="mdc-button"
              >
                Verzenden
              </button>
            </div>
          </div>
        </Fragment>
      );
    },
  };
}

function Salad(events: ProductEvents) {
  return (
    <section>
      <h1>Salades</h1>
      <ProductList {...events} products={products.salads} />
    </section>
  );
}

interface ProductListOptions {
  products: Product[];
}

interface ProductEvents {
  onSelect(product: Product): void;
}

function ProductList(options: ProductListOptions & ProductEvents) {
  const { products } = options;

  return (
    <ul class="mdc-list">
      {products.map((product) =>
        product.description ? (
          <a
            class="mdc-list-item router-link mdc-list--two-line"
            tabindex="0"
            click={() => options.onSelect(product)}
            // href={"/jennah/" + productPath(product).join("/")}
          >
            <span class="mdc-list-item__ripple"></span>
            <span class="mdc-list-item__text">
              <span class="mdc-list-item__primary-text">
                {product.title} {product.price}
              </span>
              <span class="mdc-list-item__secondary-text">
                {product.description}
              </span>
            </span>
          </a>
        ) : (
          <a
            class="mdc-list-item router-link"
            tabindex="0"
            click={() => options.onSelect(product)}
          >
            <span class="mdc-list-item__ripple"></span>
            <span class="mdc-list-item__text">
              {product.title} {product.price}
            </span>
          </a>
        )
      )}
    </ul>
  );
}

interface ProductOption {
  type: "option";
  title: string;
}
interface ProductChoice {
  type: "choice";
  title: string;
  products: Product[];
}

interface Product {
  title: string;
  price: number;
  description?: string;
  options?: ProductAddendum[];
}

type ProductAddendum = ProductOption | ProductChoice;

function Starters(events: ProductEvents) {
  return (
    <section>
      <h1>Starters</h1>
      <ProductList products={products.starters} {...events} />
    </section>
  );
}

function Traditional() {
  return (
    <section class="call-out call-out-traditioneel">
      <h1>Traditioneel</h1>
      <div>
        <h2>Starters</h2>
        <div>Harira of Bisara</div>
      </div>
      <div>
        <h2>Tajine</h2>
        <i>geserveerd met marokkaanse tarwe brood</i>)
        <div>Tajine Kip, Kefta of Vlees (</div>
        <h2>Couscous</h2>
        <div>
          Couscous Kip of Vlees met mix van groente en optie voor
          gekaramelisserde rozijnen
        </div>
      </div>
    </section>
  );
}

function Taarten() {
  return (
    <section>
      <h1 class="Tangerine">Taarten</h1>
      <div>
        <span>Chocoladetaart 4</span>, <span>Wortel taart 5</span>,{" "}
        <span>Red velvet 5</span>,{" "}
        <span>Cheesecake (oreo, snicker, citroen, stroopwafel) 5.5</span>
      </div>
    </section>
  );
}
function Smoothies() {
  return (
    <section>
      <h1 class="bungee">Smoothies</h1>
      <div>Appel-banaan, Aarbei, Avocado-banaan, Jus D'orange 4</div>
      <div>Avocado, Ace, Ananas-mango 5</div>
      <div>Mojito (alcoholvrij cocktail) 4</div>
    </section>
  );
}

function HotDrinks(events: ProductEvents) {
  return (
    <section>
      <h1>Hot drinks</h1>
      <ProductList
        products={[hotdrinks.koffie, hotdrinks.pickwick]}
        {...events}
      />
      <div class="section__content">
        Marokkaanse munt thee
        <Tile {...events} product={hotdrinks.munt.glas} title="Glas" />
        <Tile {...events} product={hotdrinks.munt.kleinpot} title="Klein" />
        <Tile {...events} product={hotdrinks.munt.grootpot} title="Groot" />
      </div>
      <ProductList
        products={[
          hotdrinks.espresso,
          hotdrinks.cappuccino,
          hotdrinks.latte,
          hotdrinks.machiatto,
          hotdrinks.chocomel,
        ]}
        {...events}
      />
    </section>
  );

  function text(product: Product) {
    return `${product.title} ${product.price}`;
  }
}

function ColdDrinks(options: MenuCallbacks) {
  return (
    <section>
      <h1>Cold drinks</h1>
      <div class="section__content product__tiles">
        {products.colddrinks.map((p: Product) => (
          <a click={() => options.onSelect(p)} class="list-item product-tile">
            {p.title}
          </a>
        ))}
        {/* <span>Cola (zero, light)</span>, <span>Fanta</span>, <span>Sprite</span>
        , <span>Bitter lemon</span>, <span>Spa (rood, blauw)</span>
        <span>Gingerale</span>, <span>Tonic</span>
        <span>Ice Tea (Lemon, Green, Peach)</span>
        <span>Fernandes (Geel, Groen, Blauw of rood)</span>
        <span>Appelsap</span>, <span>Chocomel</span>, <span>Fristi</span>
        <span>Hawai</span>, <span>Poms</span> 2.5 */}
      </div>
    </section>
  );
}

function Tajine(events: ProductEvents) {
  return (
    <section>
      <h1>Tajine</h1>
      <i>Wordt gereserveerd met marokkaanse brood (wit of bruin)</i>
      <ProductList products={products.tajines} {...events} />
    </section>
  );

  return (
    <section>
      <h1>Tajine</h1>
      <div>
        Tajine Kip 12.5, Vlees 14.5, Pilpil 14, of
        <span class="nowrap">Kefta 13</span>
      </div>
    </section>
  );
}

function Couscous(events: ProductEvents) {
  return (
    <section>
      <h1>Couscous</h1>
      <ProductList products={products.couscous} {...events} />
    </section>
  );
  return (
    <section>
      <h1>Couscous</h1>
      <div>
        Couscous Vegie 10, <span class="nowrap">Kip 13</span> of
        <span class="nowrap">Vlees 14</span>
      </div>
      <hr />
      <i>Met keuze uit zoete uien / rozijnen en kikkererwten</i>
    </section>
  );
}

function Desserts(events: ProductEvents) {
  return (
    <section>
      <h1>Desserts</h1>
      <ProductList products={products.desserts} {...events} />
    </section>
  );
}

function Grill(events: ProductEvents) {
  return (
    <section>
      <h1>Grill & Schotels</h1>
      <i>Al onze grill gerechten worden geserveerd met friet of rijst</i>
      <ProductList products={products.grill} {...events} />
    </section>
  );
}

function Sandwich(events: ProductEvents) {
  return (
    <section>
      <h1>Sandwich (broodjes)</h1>
      <i>In combinatie met friet en een drankje vanaf 9</i>
      <ProductList products={products.sandwiches} {...events} />
    </section>
  );
}

function Paninis(events: ProductEvents) {
  return (
    <section>
      <h1>Paninis</h1>
      <ProductList products={products.paninis} {...events} />
    </section>
  );
}

function Burgers(events: ProductEvents) {
  return (
    <section>
      <h1>Burgers (van de grill)</h1>
      <i>
        Al onze burgers worden geserveerd cheddar kaas uien en met huisfrietjes
      </i>
      <ProductList products={products.burgers} {...events} />
    </section>
  );
}

function Pasta(events: ProductEvents) {
  return (
    <section>
      <h1>Pasta</h1>
      <ProductList products={products.pasta} {...events} />
    </section>
  );
}

function productPath(product: Product) {
  return [product.title.replace(/(\s|[^\w])+/gi, "-").toLocaleLowerCase()];
}

function discount(products: Product[], discount: number) {
  return products.map((product) => {
    return {
      ...product,
      price: product.price - discount,
    };
  });
}

function compose(...fns: Function[]) {
  return function () {
    for (const fn of fns) {
      fn();
    }
  };
}

function equalOrderOptions(o1: OrderOption[], o2: OrderOption[]) {
  if (!o1 || !o2) return false;
  if (o1.length != o2.length) return false;

  for (const entry of o1) {
    if (!o2.find((x) => x.title == entry.title)) return false;
  }
  for (const entry of o2) {
    if (!o1.find((x) => x.title == entry.title)) return false;
  }
  return true;
}

interface TileOptions {
  product: Product;
  title?: string;
}
function Tile(options: TileOptions & ProductEvents) {
  const { product, title } = options;
  return (
    <a click={(_) => options.onSelect(product)} class="product-tile">
      {title || product.title} {product.price}
    </a>
  );
}

function hasAny(arr?: unknown[]) {
  return Array.isArray(arr) && arr.length > 0;
}
