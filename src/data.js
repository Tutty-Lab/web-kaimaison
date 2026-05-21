const generated = (name) => `${import.meta.env.BASE_URL}generated/${name}`;
const publicAsset = (name) => `${import.meta.env.BASE_URL}${name}`;
const kai = (name) => generated(`kai/${name}`);
const bird = (name) => generated(`bird/${name}`);

export const images = {
  logo: generated("kai-maison-logo.svg"),
  hero: kai("home-bar.webp"),
  aboutHero: kai("contact-hall.webp"),
  aboutMenu: generated("dining-room.webp"),
  teamMimi: publicAsset("wine.jpg"),
  teamDoug: generated("carved-chair.webp"),
  teamDipti: generated("prep-counter.webp"),
  chef: generated("bar-tables.webp"),
  menuHand: kai("menu-table.webp"),
  wine: publicAsset("wine.jpg"),
  dessert: kai("dish-fish.webp"),
  grill: kai("dish-beef.webp"),
  coasters: kai("dish-duck.webp"),
  plateSocial: kai("menu-table.webp"),
  foodPlate: kai("dish-fish.webp"),
  banquette: generated("banquette.webp"),
  dining: generated("dining-room.webp"),
  entrance: generated("entrance-arch.webp"),
  neon: generated("neon-window.webp"),
  flowersWindow: generated("flowers-window.webp"),
  tableCorner: generated("corner-table.webp"),
  tableRound: generated("round-table.webp"),
  goldMirror: generated("gold-mirror.webp"),
  mantelTable: generated("mantel-table.webp"),
  ceilingLight: generated("ceiling-light.webp"),
  gardenTable: generated("garden-table.webp"),
  windowTable: generated("window-table.webp"),
  terrace: generated("terrace-chairs.webp"),
  outdoorTable: generated("outdoor-table.webp"),
  canal: generated("canal-trees.webp"),
  prepCounter: generated("prep-counter.webp"),
  illustration: kai("illustration-home.webp"),
  dishBeef: kai("dish-beef.webp"),
  dishFish: kai("dish-fish.webp"),
  dishDuck: kai("dish-duck.webp"),
  stripFoodService: kai("strip-food-service.webp"),
  stripPlatedBite: kai("strip-plated-bite.webp"),
  stripCocktail: kai("strip-cocktail.webp"),
  stripDiningService: kai("strip-dining-service.webp"),
};

export const birdIcons = [
  bird("blue.png"),
  bird("green.png"),
  bird("black.png"),
  bird("red.png"),
];

export const photoStrips = {
  about: [
    { src: images.entrance, alt: "Kai Maison entrance arch" },
    { src: images.flowersWindow, alt: "Kai Maison floral window detail" },
    { src: images.dining, alt: "Kai Maison dining room" },
    { src: images.goldMirror, alt: "Kai Maison mirror and warm lighting" },
  ],
  menu: [
    { src: images.menuHand, alt: "Kai Maison dishes on a marble table" },
    { src: images.dishFish, alt: "Kai Maison fish dish" },
    { src: images.dishDuck, alt: "Kai Maison duck dish" },
    { src: images.dishBeef, alt: "Kai Maison beef dish" },
  ],
  form: [
    { src: images.stripFoodService, alt: "Kai Maison dish served at the marble counter" },
    { src: images.stripPlatedBite, alt: "Kai Maison plated bite" },
    { src: images.stripCocktail, alt: "Kai Maison cocktail" },
    { src: images.stripDiningService, alt: "Kai Maison dining service" },
  ],
  contact: [
    { src: images.aboutHero, alt: "Kai Maison hallway" },
    { src: images.entrance, alt: "Kai Maison entrance" },
    { src: images.outdoorTable, alt: "Kai Maison outdoor table" },
    { src: images.canal, alt: "Kai Maison neighborhood view" },
  ],
};

export const menuDocuments = {
  food: {
    label: "Food",
    pdf: generated("menu-food.pdf"),
    note: "A la carte dishes from Kai Maison's current food menu.",
    sections: [
      {
        title: "Appetizers",
        wide: true,
        groups: [
          {
            title: "Cold Appetizers",
            items: [
              {
                name: "Ceviche 44 Club",
                price: "10.5",
                desc:
                  "herbal-cured salmon, pomegranate, green apple, avocado, sun-dried cherry tomatoes, vietnamese herbs, lime olive oil dressing",
              },
              {
                name: "Salmon Tataki",
                price: "10.5",
                desc: "fresh salmon, goat horn pepper, dill, cherry tomatoes, orange, passionfruit dressing",
              },
              {
                name: "Beef Tartare",
                price: "13",
                desc: "angus tenderloin, pickled cucumber, capers, vietnamese basil, olive oil",
              },
              {
                name: "Grilled Octopus Salad",
                price: "13",
                desc:
                  "beetroot, cherry tomatoes, avocado, goat horn pepper, coriander, crispy sliced almonds, sesame dressing",
              },
              {
                name: "Kai Caesar Salad",
                price: "10.5",
                desc: "romaine lettuce, prawns, black sesame, parmesan cheese, crispy sliced almonds",
              },
              {
                name: "Hamachi \"Tai Chanh\"",
                price: "16.5",
                desc: "green apple, olive oil, dill oil, black garlic jelly, lime dressing, cherry tomatoes, physalis",
              },
              {
                name: "Tuna Ponzu Au Com",
                price: "11.5",
                desc: "fresh tuna, goat horn pepper, hanoi green rice flakes, ponzu soy sauce",
              },
              {
                name: "Saigon Beef Taco",
                price: "6",
                desc:
                  "braised beef with vietnamese gac, star anise & black cardamom, pickles, coriander, homemade spicy mayo",
              },
            ],
          },
          {
            title: "Hot Appetizers",
            items: [
              {
                name: "Sesame Crispy Prawn",
                price: "8",
                desc: "tiger prawns, black sesame, crispy sliced almonds, homemade kai mayonnaise",
              },
              {
                name: "Grilled Hamachi",
                price: "17",
                desc: "grilled pineapple, vinaigrette salad, yuzu lemon sauce",
              },
              {
                name: "Co To Scallop",
                price: "9.5",
                desc: "glass noodles, carrot, coriander, crispy sweet potato, sweet & sour fish sauce",
              },
              {
                name: "Tropical Angus",
                price: "11.5",
                desc: "beef tenderloin, grilled pineapple, salsa, vietnamese herbs, sweet & sour fish sauce",
              },
            ],
          },
        ],
      },
      {
        title: "Soups",
        groups: [
          {
            items: [
              {
                name: "Highland Mushroom",
                price: "9.5",
                desc: "seasonal mushrooms, pan-seared scallops, coriander",
              },
              {
                name: "Pumpkin",
                price: "8.5",
                desc: "grilled prawns, croutons, ginger, onion, cinnamon, fresh cream, olive oil",
              },
            ],
          },
        ],
      },
      {
        title: "Main Courses",
        wide: true,
        groups: [
          {
            items: [
              {
                name: "Stuffed Chicken Thigh",
                price: "19",
                desc:
                  "stuffed chicken thigh 220g, shiitake mushrooms and vegetables, sauteed haricots verts, kai umami sauce",
              },
              {
                name: "Barbary Duck Breast",
                price: "21",
                desc:
                  "pan-seared duck breast 200g, homemade candied orange peel, baby broccoli, grilled seasonal mushrooms, sweet potato espuma, orange sauce",
              },
              {
                name: "Striploin Beef",
                price: "23",
                desc:
                  "grilled striploin beef 240g, green peppercorn sauce, baby broccoli, charred seasonal mushrooms, sweet potato espuma",
              },
              {
                name: "Beef Filet Mignon",
                price: "27",
                desc: "beef filet mignon 220g, charred asparagus, cauliflower espuma, sesame sauce",
              },
              {
                name: "Lamb Chop",
                price: "26",
                desc: "lamb chop 250g, grilled baby zucchini, grilled seasonal mushrooms, pumpkin espuma",
              },
              {
                name: "Duck Curry",
                price: "16",
                desc: "crispy duck 220g, pumpkin, button mushrooms, aubergine, coconut cream, st25 fragrant rice",
              },
              {
                name: "Mackerel",
                price: "21",
                desc: "grilled mackerel 300g, charred pineapple, salsa, shrimp oil, roasted pepper pesto",
              },
              {
                name: "Salmon No.23",
                price: "19.5",
                desc: "pan-seared salmon 200g, charred asparagus, pumpkin espuma, passionfruit sauce",
              },
              {
                name: "Kai Carbonara Udon",
                price: "18",
                desc: "beef bacon, scallions, pepper, parmesan, udon, butter x sake sauce, chanterelles",
              },
            ],
          },
        ],
      },
      {
        title: "Vegetarian",
        groups: [
          {
            items: [
              {
                name: "Grilled Aubergine a l'Indochine",
                price: "8",
                desc: "spring onion oil, fried shallots, roasted peanuts (vn)",
              },
              {
                name: "Charred Asparagus",
                price: "8",
                desc: "pumpkin espuma, teriyaki sauce (vn)",
              },
              {
                name: "Garden Curry",
                price: "14.5",
                desc: "tofu, pumpkin, broccoli, button mushrooms, aubergine, coconut cream, st25 fragrant rice (vg)",
              },
              {
                name: "Braised King Oyster Mushroom",
                price: "15",
                desc: "bok choy, shiitake mushrooms, soy sauce, st25 fragrant rice (vn)",
              },
              {
                name: "Mushroom Udon Carbonara",
                price: "16",
                desc: "seasonal mushrooms, yellow miso, parmesan cheese (vg)",
              },
            ],
          },
        ],
      },
      {
        title: "Desserts",
        groups: [
          {
            items: [
              {
                name: "Ha Giang Black Sticky Rice",
                price: "7",
                desc: "yogurt, coconut milk, vanilla ice cream",
              },
              {
                name: "Creme Caramel",
                price: "7",
                desc: "seasonal fruits",
              },
              {
                name: "Vin Rouge Poached Pear",
                price: "9",
                desc: "chestnut cream, almond tart, vanilla ice cream",
              },
            ],
          },
        ],
      },
      {
        title: "Sides",
        compact: true,
        groups: [
          {
            items: [
              { name: "Baguette Toast", price: "3" },
              { name: "Sweet Potato Fries", price: "5.5" },
              { name: "Garlic Butter Udon", price: "4" },
              { name: "Espuma", price: "3.5" },
              { name: "Extra Sauce", price: "3.5" },
              { name: "Rice Blend", price: "3" },
            ],
          },
        ],
      },
      {
        title: "Set Menu",
        wide: true,
        groups: [
          {
            items: [
              {
                name: "Kai Signature Set Menu",
                price: "40",
                desc: "Ceviche 44 Club / Sesame Crispy Prawn / Stuffed Chicken Thigh / Ha Giang Black Sticky Rice",
              },
              {
                name: "Chef's Selection Menu",
                price: "48",
                desc: "Tuna Ponzu Au Com / Highland Mushroom Soup / Striploin Beef / Vin Rouge Poached Pear",
              },
            ],
          },
        ],
      },
    ],
    footnote: "If you have any allergies or dietary restrictions, please inform our service team for guidance.",
  },
  drinks: {
    label: "Drinks",
    pdf: generated("menu-drinks.pdf"),
    note: "Cocktails, wine, beer, shots and non-alcoholic drinks.",
    sections: [
      {
        title: "Aperitif",
        groups: [
          {
            items: [
              { name: "Aperol Spritz", price: "7.5", desc: "aperol, prosecco, soda, orange" },
              { name: "Lillet Raspberry", price: "7.5", desc: "lillet rouge, wild berry raspberry, strawberry" },
              { name: "Hugo", price: "8", desc: "st. germain, cremant, mint, lime" },
              { name: "Yuzu Sake Spritz", price: "9", desc: "sake, yuzu, prosecco, tonic, lime" },
              { name: "Gin Tonic Tanqueray", price: "10.5", desc: "hendricks, monkey, roku, kyro + 2" },
              { name: "Tokyo Mule", price: "11", desc: "haku vodka, ginger beer, lime, cucumber" },
            ],
          },
        ],
      },
      {
        title: "Signature Cocktail",
        groups: [
          {
            items: [
              { name: "Velvet Dawn", price: "9", desc: "remy martin, yuzu, cremant brut, egg white" },
              { name: "Kaigroni", price: "10.5", desc: "gin, campari, vermouth, orange bitters" },
              {
                name: "Red Ember",
                price: "10.5",
                desc: "tequila, cointreau, lime juice, beetroot syrup, pink peppercorn, chili salt",
              },
              { name: "Pomelo Sour", price: "11", desc: "gin, montenegro, grapefruit, lime, angostura, egg white" },
              { name: "Goodbye Sadness", price: "11", desc: "haku vodka, passoa liqueur, vanilla, champagne" },
              { name: "Quiet Gray", price: "11", desc: "haku vodka, mr black liqueur, espresso" },
              { name: "Rouge Blossom", price: "11", desc: "gin, sake, lime, strawberry, egg white" },
              { name: "44 Club", price: "12", desc: "gin, chambord, raspberry, lime, sugar, aquafaba" },
              { name: "Child Of Darkness", price: "12", desc: "whiskey, orange, lime, angostura bitters, egg white" },
              { name: "Fleur de Lune", price: "12", desc: "lavender, lime, butterfly pea, gum, vanilla, vermouth, egg white" },
            ],
          },
        ],
        footnote: "(*) Vegan egg white option available",
      },
      {
        title: "Wine Menu",
        wide: true,
        groups: [
          {
            title: "Bubbles",
            note: "0.15 / 0.75",
            items: [
              {
                name: "Cremant de Bordeaux | Maison Castel",
                price: "6.5/32",
                desc: "Cremant de Bordeaux (FR), Semillon/Sauv. Blanc, NV, 12%",
              },
              { name: "Veuve Pelletier", price: "50", desc: "Vin Mousseux (FR), Chardonnay, NV, 11.5%" },
              {
                name: "Reserve Brut | Philippe Gonet",
                price: "80",
                desc: "Champagne (FR), PN/Chard./PM, NV, 12%",
              },
            ],
          },
          {
            title: "Pet-Nat",
            items: [
              { name: "Hang On 2023 | Soma Vines", price: "28", desc: "Pet-Nat (DE), Pinot Blanc/Chard., NV, 11%" },
              { name: "Maria Pet Nat | Entre Vinyes", price: "33", desc: "Pet-Nat (ES), Xarel-lo/Muscat, NV, 11.5%" },
              {
                name: "Arktika | Anita & Hans Nittnaus",
                price: "42",
                desc: "Sparkling Wine (AT), St. Laurent, NV, 12%",
              },
            ],
          },
          {
            title: "Rose",
            items: [
              {
                name: "Wechsler Rose | Katharina Wechsler",
                price: "5.5/25",
                desc: "Rheinhessen QW (DE), Spatburg./Dornfelder, NV, 12.5%",
              },
              {
                name: "Chateau de Roquefort \"Corail\" Rose",
                price: "6.5/31.5",
                desc: "Provence (FR), Grenache/Syrah/Cinsault/Clairette, 2023, 12.5%",
              },
              { name: "A Table!!! Rose | Mas del Perie", price: "42", desc: "Vin de France (FR), Malbec/Merlot/Tannat, 2023, 12%" },
            ],
          },
          {
            title: "White",
            items: [
              {
                name: "Seckinger Blanc de Noir | Seckinger",
                price: "5.5/26",
                desc: "Pfalz QW (DE), Spatburg., NV, 12%",
              },
              {
                name: "Spielberg Riesling Kabinett 2022 | Darting",
                price: "6.5/30",
                desc: "Pfalz QW (DE), Riesling, 2022, 10.5%",
              },
              {
                name: "Root Weiss | Hareter",
                price: "6.5/30",
                desc: "Burgenland QW (AT), Chard./Neuburger, NV, 12.5%",
              },
              { name: "Nero Bianco | Seckinger", price: "32", desc: "Pfalz QW (DE), Gewurztraminer, 2023, 11.5%" },
              {
                name: "Le Soleillant | Jean Marie Chenivesse",
                price: "38",
                desc: "Cotes du Rhone Blanc (FR), Gren. Blanc/Viog./Rouss., 2023, 13.5%",
              },
              { name: "Dauny Sancerre | Vignoble Dauny", price: "50", desc: "Sancerre AOC (FR), Sauv. Blanc, 2023, 13%" },
              { name: "Cecile #44 | Dornach", price: "62", desc: "Sudtirol (IT), Bronner/Solaris, 2022, 12.5%" },
            ],
          },
          {
            title: "Skin Contact",
            note: "0.15 / 0.75",
            items: [
              {
                name: "Oniric Brisat Vermell | Entre Vinyes",
                price: "5.5/26.5",
                desc: "Orange Wine (ES), Xarel-lo Vermell, NV, 11.5%",
              },
              {
                name: "Feteasca Regala | La Sapata",
                price: "6/28",
                desc: "DOC Sarica Niculitel (RO), Feteasca Regala, 2023, 13%",
              },
              { name: "Brand & Co Elsass 2022 | Brand & Fils", price: "32", desc: "Alsace AOC (FR), Pinot Gris/Riesling/Silv., 2022, 12%" },
              { name: "Belle Naturelle | Jurtschitsch", price: "37.5", desc: "Kamptal (AT), Natural white, NV, 12.5%" },
              { name: "Alter 2020 | Sumenjak", price: "40", desc: "Orange Wine (SI), Chard./Riesling, 2020, 13%" },
              {
                name: "Kalk & Kiesel Weiss | Claus Preisinger",
                price: "44",
                desc: "Burgenland QW (AT), WB/GV/Muskat./Welsch., NV, 11.5%",
              },
              { name: "Labeja Riesling | Alex Saltaren", price: "49", desc: "Rheinhessen (DE), Riesling, NV, 11.5%" },
              { name: "Sav'Or | Domaine de la Pinte", price: "58", desc: "Jura (FR), Savagnin (mac.), 13%" },
            ],
          },
          {
            title: "Red",
            items: [
              {
                name: "Cuvee Papillon | Jean-Marie Chenivesse",
                price: "6/29",
                desc: "Cotes du Rhone (FR), Grenache/Syrah, NV, 13.5%",
              },
              {
                name: "Chianti Classico | Le Fonti",
                price: "6/30",
                desc: "Toscana DOCG (IT), Sangiovese/Cab. Sauv./Merlot, 13.5%",
              },
              { name: "Cabernet Cubin Trocken 2018 | Darting", price: "6.5/32", desc: "Pfalz QW (DE), Cabernet Cubin, 2018, 13.5%" },
              { name: "Puszta Libre | Claus Preisinger", price: "34", desc: "Burgenland QW (AT), Zweigelt/St. Laurent, 2023, 12%" },
              { name: "UnRouge 2022 | Bossanova", price: "40", desc: "Abruzzen (IT), 80% Montep./20% Merlot, 2022, 13.5%" },
              { name: "La Musa 2021 | Val Liberata", price: "44", desc: "Piemont (IT), Nebbiolo, 2021, 13.5%" },
              { name: "Janus | Marco Merli", price: "58", desc: "Umbrien (IT), Sangiovese, 2021, 13%" },
              { name: "Louis #38 | Dornach", price: "62", desc: "Sudtirol (IT), Pinot Nero, 2022, 10.5%" },
            ],
          },
        ],
        footnote: "(*) Information about allergens and additives is available upon request from our service staff.",
      },
      {
        title: "Beer",
        groups: [
          {
            title: "From Tap",
            note: "0.3 / 0.5",
            items: [
              { name: "Krombacher Pils", price: "4 / 5.5" },
              { name: "Starnberger Helles", price: "4 / 5.5" },
            ],
          },
          {
            title: "From Bottle",
            items: [
              { name: "Tiger", price: "4" },
              { name: "Krombacher Weizen", price: "5" },
              { name: "Krombacher Alkf. Weizen", price: "5" },
            ],
          },
        ],
      },
      {
        title: "Shots",
        groups: [
          {
            title: "Vodka",
            items: [
              { name: "Haku Vodka | Japanese Craft Vodka (JP), 40%", price: "4" },
              { name: "Belvedere Vodka | Polish Rye Vodka (PL), 40%", price: "6" },
            ],
          },
          {
            title: "Gin",
            items: [
              { name: "Roku Gin, Tanqueray, Hendrick's", price: "3.5" },
              { name: "Berlin Dark Dry Gin | New Western Dry Gin (DE), NV, 43.3% ABV", price: "4.5" },
              { name: "Monkey 47 | Schwarzwald Dry Gin (DE), 47%", price: "5.5" },
              { name: "Kyro Gin - Distillery Company | FI, Rye Gin, NV, 46.3%", price: "5.5" },
            ],
          },
          {
            title: "Mezcal",
            items: [{ name: "Montelobos Espadin, Del Maguey Tobala, San Cosme", price: "4" }],
          },
          {
            title: "Whiskey",
            items: [
              { name: "Jameson Black Barrel | Blended Irish Whiskey (IE), NAS NV, 40% ABV", price: "4.5" },
              { name: "Suntory Toki | Blended Japanese Whisky (JP), NAS, 43% ABV", price: "5.5" },
              { name: "Glenfiddich 18 | Single Malt Scotch (UK), 18YO, 40%", price: "6.5" },
              { name: "Nikka From The Barrel | Nikka JP, Blended Whisky, NV, 51.4%", price: "6.5" },
              { name: "Hibiki Japanese Harmony - Suntory | JP, Blended Whisky, NV, 43%", price: "7.5" },
            ],
          },
        ],
      },
      {
        title: "Kai's Homemade",
        groups: [
          {
            items: [
              { name: "Lime Soda", price: "6", desc: "lime, mint, sugar, soda" },
              { name: "Passion Love", price: "6.5", desc: "green tea, passion fruit, honey" },
              { name: "Yuzu Cooler", price: "6.5", desc: "yuzu, fresh orange, soda, lime" },
              { name: "Raspberry Night", price: "6.5", desc: "fresh raspberry, jasmine tea, mint" },
              { name: "Palonia", price: "7.5", desc: "non alcoholic tequila, grapefruit, agave" },
            ],
          },
        ],
      },
      {
        title: "Coffee x Andraschko",
        groups: [
          {
            items: [
              { name: "Espresso / Double Espresso", price: "2.5/3", desc: "macchiato + 0.5" },
              { name: "Americano", price: "3.2" },
              { name: "Cappuccino", price: "3.5" },
              { name: "Flat White", price: "4" },
              { name: "Latte Macchiato", price: "4" },
              { name: "Matcha Latte", price: "4", desc: "on ice, oat milk + 0" },
            ],
          },
        ],
      },
      {
        title: "Tea",
        groups: [
          {
            items: [
              { name: "Green / Jasmine", price: "3.5" },
              { name: "Mint Lime", price: "4" },
              { name: "Ginger Orange", price: "4" },
              { name: "Kai's Detox", price: "4.5", desc: "dates, goji berries, ginger, mint" },
            ],
          },
        ],
      },
      {
        title: "Softdrinks",
        groups: [
          {
            items: [
              { name: "Coca Cola / Cola Zero", price: "3.5" },
              { name: "Schweppes", price: "3.5", desc: "tonic, ginger ale, ginger beer" },
              { name: "Filtered Water", price: "2 / 5", desc: "0.25 / 0.75" },
              { name: "Voslauer", price: "3 / 6", desc: "still, sparkling" },
              { name: "Rauch", price: "4", desc: "apple, mango, rhubarb" },
            ],
          },
        ],
      },
    ],
  },
};

export const site = {
  name: "Kai Maison",
  title: "Kai Maison - Table et Bar",
  description:
    "Kai Maison is a modern casual dining restaurant and art and music venue on Berlin's Landwehr Canal.",
  address: "Maybachufer 23, 12047 Berlin",
  addressShort: "Maybachufer 23",
  ward: "12047 Berlin",
  email: "kaimaisonberlin@gmail.com",
  phone: "030 88 77 33 98",
  phoneHref: "+493088773398",
  hours: "Monday - Sunday: 12:00 pm - 12:00 am",
  reservation: "https://www.opentable.de/r/kai-maison-reservations-berlin?restref=333144&lang=en-US",
  maps: "https://www.google.com/maps/search/?api=1&query=Maybachufer%2023%2C%2012047%20Berlin",
  instagram: "https://www.instagram.com/kaimaison.berlin",
  facebook: "https://www.facebook.com/kaimaisonberlin",
  tiktok: "https://www.tiktok.com/@kaimaisonberlin",
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Menus", href: "/a-la-carte-menu" },
  { label: "About", href: "/about" },
  { label: "Press", href: "/press" },
  { label: "Events", href: "/events" },
  { label: "Functions", href: "/functions-catering" },
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "Contact", href: "/contact" },
];

export const pressItems = [
  {
    title: "The WA Good Food Guide",
    date: "2025-11-16",
    summary: "WAGFG's monthly round-up of what the team is eating, drinking, booking and buying",
    image: images.hero,
    href: "/press/wa-good-food-guide",
  },
  {
    title: "Michelin 2025",
    date: "2025-06-05",
    summary: "Featured in Michelin Guide Vietnam for the third year",
    image: images.entrance,
    href: "/press/michelin-2025",
  },
  {
    title: "Tatler Asia",
    date: "2024-12-27",
    summary: "Modern Asian cuisine with sophisticated flavors and...",
    image: images.dishFish,
    href: "/press/tatler-asia",
  },
  {
    title: "Viet Nam News",
    date: "2024-12-22",
    summary: "Michelin-approved: Why Elgin is the talk of District 1",
    image: images.banquette,
    href: "/press/viet-nam-news",
  },
  {
    title: "iknowthesomm.com",
    date: "2024-04-17",
    summary: "It's all about the Wines | Food | Bars",
    image: images.wine,
    href: "/press/iknowthesommcom",
  },
  {
    title: "Vetter Magazine",
    date: "2024-04-17",
    summary: "A place that is both stylish and delicious",
    image: images.flowersWindow,
    href: "/press/vetter-magazine",
  },
  {
    title: "Michelin Guide Vietnam",
    date: "2024-04-01",
    summary: "Michelin Guide 2023 and 2024",
    image: images.ceilingLight,
    href: "/press/michelin",
  },
  {
    title: "Vezzi",
    date: "2023-12-19",
    summary: "Ho Chi Minh Restaurants Guide",
    image: images.menuHand,
    href: "/press/vezzi",
  },
  {
    title: "The B.A.R. Awards",
    date: "2023-12-14",
    summary: "The top five in the Best Restaurant category",
    image: images.mantelTable,
    href: "/press/the-bars-awards",
  },
  {
    title: "Travel and Leisure Taste Makers",
    date: "2023-11-30",
    summary: "T+L Taste Makers 25 Best Restaurants in Vietnam",
    image: images.windowTable,
    href: "/press/travel-and-leisure",
  },
  {
    title: "Leisure and Travel",
    date: "2023-10-29",
    summary: "Michelin Guide Selected dining series",
    image: images.dining,
    href: "/press/leisure-and-travel",
  },
  {
    title: "Prestige Hong Kong - Logan Hester",
    date: "2023-07-14",
    summary: "Chef Eats: Logan Hester's Favourite Restaurants in HCMC",
    image: images.illustration,
    href: "/press/prestige",
  },
  {
    title: "Dot Magazine",
    date: "2022-12-29",
    summary: "The Best New Bars And Restaurants In Saigon In 2022",
    image: images.prepCounter,
    href: "/press/dot-magazine",
  },
  {
    title: "Sketch magazine",
    date: "2022-10-25",
    summary: "Enjoy everything from food to drinks",
    image: images.outdoorTable,
    href: "/press/sketch-magazine",
  },
  {
    title: "Barrons",
    date: "2022-10-21",
    summary: "Great Escapes: Ho Chi Minh City, Vietnam's Buzzing, Glitzy Jewel",
    image: images.canal,
    href: "/press/barrons",
  },
  {
    title: "Jovel Chan Blog",
    date: "2022-10-10",
    summary: "My top 25 restaurants in Ho Chi Minh City",
    image: images.dishDuck,
    href: "/press/blog-post-title-four-2cewk",
  },
];

export const eventItems = [
  {
    title: "Good Wines Club 2026 - Grapes Gone Global",
    date: "2026-04-12",
    summary: "The Good Wines Club is back, and we're taking it global. Swing by, sip up, and go global.",
    image: images.wine,
    href: "/events/good-wines-club-4c6wg",
  },
  {
    title: "Festive Menu 2025",
    date: "2025-12-09",
    summary: "Our Festive Menu is here, and we can't wait to celebrate with you!",
    image: images.menuHand,
    href: "/events/festive-menu",
  },
  {
    title: "Feed Me Menu",
    date: "2025-11-15",
    summary: "Our set menus are here for when you want a little bit of everything!",
    image: images.dishBeef,
    href: "/events/feed-me-menu",
  },
  {
    title: "Good Wines Club - Unlock your PAlate",
    date: "2025-08-29",
    summary: "The Good Wines Club is back. Collect experiences, sip smart, and have a blast along the way.",
    image: images.neon,
    href: "/events/good-wines-club",
  },
  {
    title: "Elgin Turns 3!",
    date: "2025-06-19",
    summary: "We're throwing a birthday bash the Elgin way: bold flavours, tasty bites, and a menu made to be shared.",
    image: images.outdoorTable,
    href: "/events/elgin-turns-3",
  },
  {
    title: "Women's Day at Elgin",
    date: "2025-03-08",
    summary: "Treat yourselves to a night of good food, yummy wines, and even better company!",
    image: images.dishDuck,
    href: "/events/womens-day-at-elgin",
  },
  {
    title: "Elgin's festive menu 2024",
    date: "2024-12-12",
    summary: "Our annual Festive Menu is here, so join us in spreading the holiday cheer!",
    image: images.mantelTable,
    href: "/events/elgins-festive-menu",
  },
  {
    title: "Welcome Party - Chef Aldwin",
    date: "2024-11-30",
    summary: "Welcoming our new Chef in Residence! A La Carte. 6PM - Late.",
    image: images.banquette,
    href: "/events/welcome-party-chef-aldwin-hidajat",
  },
  {
    title: "Elgin's American Thanksgiving",
    date: "2024-11-28",
    summary: "Offering our annual special Thanksgiving sharing set menu with your favorite family-style holiday treats!",
    image: images.dishFish,
    href: "/events/elgins-american-thanksgiving",
  },
  {
    title: "Vietnamese Women's Day",
    date: "2024-10-20",
    summary: "Whether it be your mom, your sister, your bestie, or your better half - we've got you covered!",
    image: images.flowersWindow,
    href: "/events/vietnamese-womens-day",
  },
  {
    title: "Elgin's Canadian Thanksgiving",
    date: "2024-10-14",
    summary: "Offering our annual special Thanksgiving sharing set menu with your favorite holiday treats!",
    image: images.windowTable,
    href: "/events/elgins-canadian-thanksgiving",
  },
  {
    title: "Shroom Dinner x Little Bear",
    date: "2024-09-28",
    summary: "An unforgettable evening as we welcome Chef Nhat Duy and Chef Truong Hiep from Little Bear to Elgin",
    image: images.gardenTable,
    href: "/events/shroom-dinner-x-little-bear",
  },
  {
    title: "The Good Wines Club Vol. VII",
    date: "2024-09-15",
    summary: "Join a Masterclass of Crystal",
    image: images.ceilingLight,
    href: "/events/the-good-wines-clubvol-vii",
  },
  {
    title: "Elgin 2.0 Launch Party",
    date: "2024-09-07",
    summary: "We love a good party at Elgin!",
    image: images.goldMirror,
    href: "/events/elgin-20-launch-party",
  },
  {
    title: "Potluck at Little Bear",
    date: "2024-07-13",
    summary: "Potluck Dinner - Elgin Comes to Bear's House",
    image: images.tableCorner,
    href: "/events/potluck-at-little-bear-2024",
  },
  {
    title: "Michelin 2024",
    date: "2024-06-27",
    summary: "Michelin Guide Vietnam",
    image: images.illustration,
    href: "/events/michelin-2024",
  },
  {
    title: "G'day Gourmet",
    date: "2024-06-22",
    summary: "Chef Josh Fry joined us for a one-night-only Aussie affair",
    image: images.terrace,
    href: "/events/gday-gourmet",
  },
  {
    title: "2nd Birthday",
    date: "2024-06-08",
    summary: "A celebration of another year of Elgin",
    image: images.canal,
    href: "/events/2nd-bday-2024",
  },
  {
    title: "To Do Canada - Wildlight x Elgin",
    date: "2024-02-01",
    summary: "World Chef Exchange Collab in Vancouver, Canada",
    image: images.dishBeef,
    href: "/events/to-do-canada-wildlight-x-elgin-2024",
  },
  {
    title: "2023 Wrap Up",
    date: "2024-01-01",
    summary: "Fond memories of pop-ups, collaborations and achievements",
    image: images.dishFish,
    href: "/events/2022-wrap-up",
  },
];
