import { tpl } from "glow.js";
import { Fragment } from "glow.js/lib/fragment";
import Css from "glow.js/components/css";
import "./menu-card.scss";

export function MainMenuCard() {
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
      <div class="menu-card">
        <div style="flex: 1;">
          <Starters />
          <Sandwich />
          <Burgers />
        </div>
        <div style="flex: 1;">
          <Salad />
          <Traditional />
          <Pasta />
        </div>
        <div style="flex: 1;">
          <Grill />
          <Tajine />
          <Couscous />
        </div>
        <div style="flex: 1;">
          <Desserts />
          <HotDrinks />
          <ColdDrinks />
        </div>
        {/* <div style="flex: 1; display: inline-flex">
          <img style="width: 100%; margin: auto 0 0 0" src={burgerSrc} />
        </div> */}
      </div>
    </Fragment>
  );
}

function Salad() {
  const products: Product[] = [
    { title: "Tonijn Salade", price: 8 },
    { title: "Ceasar Salade", price: 9 },
    { title: "Zalm Salade", price: 9 },
    { title: "Garnalen Slade", price: 9 },
  ];

  return <ProductSection products={products} title="Salades" />;
}

interface ProductSectionOptions {
  products: Product[];
  title: string;
  notes?: string;
}

function ProductSection(options: ProductSectionOptions) {
  const { products, notes } = options;
  return (
    <section>
      <h1>{options.title}</h1>
      <ul class="mdc-list">
        {products.map((product) =>
          product.description ? (
            <li class="mdc-list-item mdc-list--two-line" tabindex="0">
              <span class="mdc-list-item__ripple"></span>
              <span class="mdc-list-item__text">
                <span class="mdc-list-item__primary-text">
                  {product.title} {product.price}
                </span>
                <span class="mdc-list-item__secondary-text">
                  {product.description}
                </span>
              </span>
            </li>
          ) : (
            <li class="mdc-list-item" tabindex="0">
              <span class="mdc-list-item__ripple"></span>
              <span class="mdc-list-item__text">
                {product.title} {product.price}
              </span>
            </li>
          )
        )}
      </ul>
      {notes && [<hr />, <i class="notes">{notes}</i>]}
    </section>
  );
}

interface Product {
  title: string;
  price: number;
  description?: string;
}

function Starters() {
  var products: Product[] = [
    { title: "Harira", price: 4.5 },
    { title: "Bisara", price: 4.5 },
    { title: "Loempia", price: 3.5 },
    { title: "Tortilla", price: 5.0 },
    { title: "Nacho's", price: 7.5 },
  ];

  return <ProductSection title="Starters" products={products} />;
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
        <div>
          Tajine Kip, Kefta of Vlees (
          <i>geserveerd met marokkaanse tarwe brood</i>)
        </div>
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

function HotDrinks() {
  return (
    <section>
      <h1>Hot drinks</h1>
      <div class="section__content">Pickwick thee 2.5</div>
      <div class="section__content">
        Marokkaanse munt thee (<span class="nowrap">glas 2.5</span>,{" "}
        <span class="nowrap">kleine pot 4</span>,{" "}
        <span class="nowrap">grote pot 5</span>)
      </div>
      <div class="section__content">Warme chocolademelk 3</div>
      <div class="section__content">Espresso, Cappuccino 2.5</div>
      <div class="section__content">Caffe Latte Macchiato 3.5</div>
    </section>
  );
}
function ColdDrinks() {
  const products: Product[] = [
    { title: "Cola", price: 2.5 },
    { title: "Fanta", price: 2.5 },
    { title: "Sprite", price: 2.5 },
    { title: "Bitter Lemon", price: 2.5 },
    { title: "Spa", price: 2.5 },
    { title: "Ginger Ale", price: 2.5 },
    { title: "Ice Tea", price: 2.5 },
    { title: "Ice Tea", price: 2.5 },
  ];
  return (
    <section>
      <h1>Cold drinks</h1>
      <div class="section__content">
        <span>Cola (zero, light)</span>, <span>Fanta</span>, <span>Sprite</span>
        , <span>Bitter lemon</span>, <span>Spa (rood, blauw)</span>
        <span>Gingerale</span>, <span>Tonic</span>
        <span>Ice Tea (Lemon, Green, Peach)</span>
        <span>Fernandes (Geel, Groen, Blauw of rood)</span>
        <span>Appelsap</span>, <span>Chocomel</span>, <span>Fristi</span>
        <span>Hawai</span>, <span>Poms</span> 2.5
      </div>
      <div class="section__content">Red Bull 3</div>
    </section>
  );
}

function Tajine() {
  const products: Product[] = [
    { title: "Tajine kip", price: 12.5 },
    { title: "Tajine Vlees", price: 14.5 },
    { title: "Tajine Pilpil", price: 14 },
    { title: "Tajine Kefta", price: 11 },
  ];

  return (
    <ProductSection
      products={products}
      title="Tajine"
      notes="Wordt gereserveerd met marokkaanse brood (wit of bruin)"
    />
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

function Couscous() {
  const products: Product[] = [
    { title: "Vegie", price: 10 },
    { title: "Kip", price: 12 },
    { title: "Vlees", price: 13 },
    { title: "Royaal", price: 14.5 },
  ];

  return (
    <ProductSection
      products={products}
      title="Couscous"
      // notes="Met keuze uit zoete uien / rozijnen en kikkererwten"
    />
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

function Desserts() {
  const products: Product[] = [
    {
      title: "Cheese cake",
      price: 5.5,
      description: "Informeer naar onze variaties",
    },
    { title: "Redvelvet", price: 5.5 },
    { title: "Worteltaart", price: 5.5 },
  ];

  return <ProductSection products={products} title="Desserts" />;
}

function Grill() {
  const products: Product[] = [
    { title: "Kip Filet", price: 13.5 },
    { title: "Kalfs Spies", price: 14 },
    { title: "Kip Sate", price: 13.5 },
    { title: "Mix Grill", price: 17.5 },
    { title: "Kefta Schotel", price: 13 },
    { title: "Zalm Schotel", price: 13 },
    { title: "Garnalen Schotel", price: 14 },
    { title: "Sausage / Merquez Schotel", price: 14 },
  ];
  return (
    <ProductSection
      products={products}
      title="Grill & Schotels"
      notes="Al onze grill gerechten worden geserveerd met friet of rijst"
    />
  );
}

function Sandwich() {
  const products: Product[] = [
    { title: "Kip (of hete kip)", price: 6.5 },
    { title: "Kefta", price: 6.5 },
    { title: "Kip tenders (van de grill)", price: 7.5 },
    { title: "Sausage / Merquez", price: 7 },
    { title: "Garnalen", price: 7.5 },
  ];
  return (
    <ProductSection
      products={products}
      title="Sandwich (broodjes)"
      notes="In combinatie met friet en een drankje vanaf 9"
    />
  );
}

function Burgers() {
  var products: Product[] = [
    { title: "Jennah Burger", price: 10.5, description: "bla" },
    { title: "Cheese Burger", price: 9 },
    { title: "Kipfilet Burger", price: 8 },
    { title: "Kipgehakt Burger", price: 8 },
  ];

  return (
    <ProductSection
      title="Burgers (van de grill)"
      products={products}
      notes="Al onze burgers worden geserveerd cheddar kaas uien en met huisfrietjes"
    />
  );
  return (
    <section>
      <h1>Burgers (van de grill)</h1>
      <div>Jennah Burger met spiegelei 9.5</div>
      <div>
        Classic cheeseburger met kaas, sla, tomaat en gekarameliseerde uien 9
      </div>
      <div>Kipfilet burger 9</div>
      <div>Kipgehakt burger 8</div>
      <hr />
      <i>
        Al onze burgers worden geserveerd cheddar kaas uien en met huisfrietjes
      </i>
    </section>
  );
}

function Pasta() {
  const products: Product[] = [
    { title: "Kip", price: 12.5 },
    { title: "Garnalen en/of zalm", price: 13.5 },
    { title: "Bolognese", price: 13.5 },
    { title: "Arabiatta", price: 10 },
  ];

  return <ProductSection title="Pasta" products={products} />;
  return (
    <section>
      <h1>Pasta's</h1>
      <div class="nowrap">Kip 12.5</div>
      <div class="nowrap">Garnalen en/of zalm 13.5</div>
      <div class="nowrap">Bolognese 13.5</div>
      <div class="nowrap">Penne Arrabiata 10</div>
    </section>
  );
}
