import { tpl } from "glow.js";
import { Fragment } from "glow.js/lib/fragment";
import Css from "glow.js/components/css";
import "./menu-card.scss";

export function MainMenuCard() {
  return (
    <Fragment>
      <Css value="jennah" />
      <div class="topbar">
        Restaurant & Cafe Jennah
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
      <div class="menu-card" style="display: flex;">
        <div style="flex: 1;">
          <Starters />
          <Sandwich />
          <Burgers />
        </div>
        <div style="flex: 1;">
          <Salad />
          <CourseMeal />
          <Pasta />
        </div>
        <div style="flex: 1;">
          <Grill />
          <Tajine />
          <Couscous />
        </div>
        <div style="flex: 1; height: 100%; background-color: #111111EE">
          <Desserts />
        </div>
        {/* <div style="flex: 1; display: inline-flex">
          <img style="width: 100%; margin: auto 0 0 0" src={burgerSrc} />
        </div> */}
      </div>
    </Fragment>
  );
}

function Salad() {
  return (
    <section>
      <h1>Salades</h1>
      <div>Tonijn salade 8</div>
      <div>Ceasar salade 9</div>
      <div>Zalm salade 9</div>
      <div>Garnalen salade 9</div>
    </section>
  );
}

function Starters() {
  return (
    <section>
      <h1>Starters</h1>
      <div>Loempia 3.5</div>
      <div>Tortilla 5.0</div>
      <div>Harira 4.5</div>
      <div>Bisara 4.5</div>
      <div>Nacho's 7.5</div>
    </section>
  );
}

function CourseMeal() {
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

function Schotels() {
  return (
    <section>
      <h1 class="Tangerine">Schotels</h1>
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

function ColdDrink() {
  return <section></section>;
}

function Tajine() {
  return (
    <section>
      <h1>Tajine</h1>
      <div>
        Tajine Kip 12.5, Vlees 14.5, Pilpil 14, of{" "}
        <span class="nowrap">Kefta 13</span>
      </div>
      <hr />
      <i>Wordt gereserveerd met marokkaanse brood (wit of bruin)</i>
    </section>
  );
}

function Couscous() {
  return (
    <section>
      <h1>Couscous</h1>
      <div>
        Couscous Vegie 10, <span class="nowrap">Kip 13</span> of{" "}
        <span class="nowrap">Vlees 14</span>
      </div>
      <hr />
      <i>Met keuze uit zoete uien / rozijnen en kikkererwten</i>
    </section>
  );
}

function Desserts() {
  return (
    <section style="height: 100%;">
      <h1 class="Tangerine">Desserts</h1>
      <div class="nowrap">Cheese cakes</div>
      <div class="nowrap">Redvelvet</div>
      <div class="nowrap">Worteltaart</div>
      <h1>Hot drinks</h1>
      <div>Pickwick thee 2.5</div>
      <div>Marokkaanse munt thee (glas 2.5, kleine pot 4, grote pot 5)</div>
      <div>Warme chocolademelk 3</div>
      <div>Espresso, Cappuccino 2.5</div>
      <div>Caffe Latte Macchiato 3.5</div>
      <h1>Cold drinks</h1>
      <div>
        <span>Cola (zero, light)</span>, <span>Fanta</span>, <span>Sprite</span>
        , <span>Bitter lemon</span>, <span>Spa (rood, blauw)</span>,{" "}
        <span>Gingerale</span>, <span>Tonic</span>,{" "}
        <span>Ice Tea (Lemon, Green, Peach)</span>,{" "}
        <span>Fernandes (Geel, Groen, Blauw of rood)</span>,{" "}
        <span>Appelsap</span>, <span>Chocomel</span>, <span>Fristi</span>,{" "}
        <span>Hawai</span>, <span>Poms</span> 2.5
      </div>
      <div>Red Bull 3</div>
    </section>
  );
}

function Grill() {
  return (
    <section>
      <h1 class="Tangerine">Grill & Schotels</h1>
      <div class="nowrap">Kip Filet 13.5</div>
      <div class="nowrap">Kalfs Spies 14</div>
      <div class="nowrap">Kip Sate 13.5</div>
      <div class="nowrap">Mix Grill 17.5</div>
      <div class="nowrap">Kefta Schotel 13</div>
      <div class="nowrap">Zalm Schotel 14</div>
      <div class="nowrap">Garnalen Schotel 14</div>
      <div class="nowrap">Sausage / Merquez Schotel 14</div>
      <hr />
      <div>
        <i>Al onze grill gerechten worden geserveerd met friet of rijst.</i>
      </div>
    </section>
  );
}

function Sandwich() {
  return (
    <section>
      <h1>Sandwich (broodjes)</h1>
      <div>Kip (of hete kip) 6.5</div>
      <div>Kefta 6.5</div>
      <div>Kip tenders (van de grill) 7.5</div>
      <div>Sausage / Merquez 7</div>
      <div>Garnalen 7.5</div>
      <hr />
      <div>
        <i>In combinatie met friet en een drankje vanaf 9</i>
      </div>
    </section>
  );
}

function Burgers() {
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
