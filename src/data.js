const asset = (name) => `${import.meta.env.BASE_URL}generated/${name}`;

export const links = {
  reservation:
    "https://www.opentable.de/r/kai-maison-reservations-berlin?restref=333144&lang=en-US",
  map: "https://maps.app.goo.gl/UuBDHLeqa4gbp3sd9",
  email: "mailto:kaimaisonberlin@gmail.com",
  phone: "tel:+493088773398",
  instagram: "https://www.instagram.com/kaimaisonberlin/",
  credit: "https://tuttylab.com",
  menuPdf: asset("kai-maison-menu.pdf"),
};

export const navItems = [
  { label: "Home", href: "/en" },
  { label: "Menus", href: "/en/menu" },
  { label: "About", href: "/en/about" },
  { label: "Events", href: "/en/events" },
];

export const images = {
  logo: asset("kaimaison-logo.svg"),
  instagramLogo: asset("instagram-logo.svg"),
  hero: asset("entrance-arch.webp"),
  neon: asset("neon-window.webp"),
  neonArch: asset("neon-arch.webp"),
  flowers: asset("flowers-window.webp"),
  corner: asset("corner-table.webp"),
  round: asset("round-table.webp"),
  dining: asset("dining-room.webp"),
  bar: asset("bar-tables.webp"),
  banquette: asset("banquette.webp"),
  mantel: asset("mantel-table.webp"),
  mirror: asset("gold-mirror.webp"),
  garden: asset("garden-table.webp"),
  window: asset("window-table.webp"),
  ceiling: asset("ceiling-light.webp"),
  chair: asset("carved-chair.webp"),
  prep: asset("prep-counter.webp"),
  terrace: asset("terrace-chairs.webp"),
  outdoor: asset("outdoor-table.webp"),
  canal: asset("canal-trees.webp"),
};

export const contact = {
  addressLine1: "Maybachufer 23",
  addressLine2: "12047 Berlin",
  email: "kaimaisonberlin@gmail.com",
  phone: "030 88 77 33 98",
  hours: "Monday-Sunday 12:00 pm - 12:00 am",
  kitchen: "Monday-Sunday 12:00 pm - 11:00 pm",
};

export const posts = {
  press: [
    {
      title: "Michelin Guide Vietnam",
      eyebrow: "In the Press",
      date: "Saturday, 2 May 2026",
      summary:
        "Michelin Guide 2023 and 2024 recognition, carried into Kai Maison with a relaxed Berlin spirit.",
      href: "/en/press/michelin-guide-vietnam",
      image: images.mantel,
    },
  ],
  events: [
    {
      title: "Women's Day at Elgin",
      eyebrow: "News/Events",
      date: "Saturday, 8 March 2026",
      summary:
        "A night of good food, easygoing wines, and seasonal plates made for sharing.",
      href: "/en/events/michelin-guide-vietnam",
      image: images.flowers,
    },
  ],
};

export const galleryImages = [
  { src: images.neon, alt: "Kai Maison neon by the window" },
  { src: images.dining, alt: "Dining room tables set for service" },
  { src: images.banquette, alt: "Long banquette table with candles" },
  { src: images.window, alt: "Window table with plants" },
  { src: images.ceiling, alt: "Ceiling light and entrance arch" },
  { src: images.terrace, alt: "Terrace chairs outside Kai Maison" },
  { src: images.prep, alt: "Kitchen prep counter with ingredients" },
  { src: images.canal, alt: "Trees near the canal outside the restaurant" },
];

export const menuSections = [
  {
    title: "Aperitif x Salad",
    groups: [
      {
        title: "Hot Aperitif x Salad",
        items: [
          ["Spicy Edamame", "5.5 EUR", "Soy beans, sea salt, soy x chili sauce"],
          ["Gyoza Bay", "7 EUR", "Prawn, chicken, vegetable dumplings, umami sauce"],
          ["Crispy Rock Shrimp", "8.5 EUR", "Prawn tempura, honey mayo, almonds"],
          ["Black Tori Karaage", "7 EUR", "Fried corn chicken, charcoal, Japanese mayo, lemon"],
          ["Sun Kai Scallops", "11 EUR", "Grilled scallops, carrot puree, scallion, yuzu dressing"],
          ["Hokkaido Tako", "13 EUR", "Grilled octopus, tomato, avocado, onion, sesame sauce"],
        ],
      },
      {
        title: "Cold Aperitif x Salad",
        items: [
          ["Ceviche 44", "9.5 EUR", "Organic salmon and tuna, tomato, onions, ceviche sauce"],
          ["Beef Tataki", "11.5 EUR", "Flamed beef, onions, dried flowers, cold wafu sauce"],
          ["Kai Salad", "12 EUR", "Crispy prawn, mixed salad, chili mayo, yuzu x truffle dressing"],
          ["Tuna Ponzu Truffle", "12.5 EUR", "Tuna tataki, crispy garlic, chili, truffle, ponzu"],
          ["Black Truffle Spinach", "9 EUR", "Baby spinach, truffle, fish roe, su x miso"],
          ["De Boeuf Tartare", "13 EUR", "Beef tenderloin, egg yolk, black caviar, tartare sauce"],
        ],
      },
    ],
  },
  {
    title: "Temaki x Taco",
    groups: [
      {
        items: [
          ["Temaki Salmon", "6 EUR", "Fresh salmon, pickles, scallion, teriyaki x miso"],
          ["Temaki King Crab", "7.5 EUR", "King crab, truffle, pickles, scallion, spicy miso"],
          ["Shrimp Taco", "6 EUR", "King prawn, pickles, coriander, chili mayo"],
          ["Chicken Taco", "6 EUR", "Chicken, pickles, coriander, chili mayo"],
          ["Beef Taco", "6 EUR", "Beef, pickles, coriander, chili mayo"],
        ],
      },
    ],
  },
  {
    title: "Mains",
    groups: [
      {
        items: [
          ["Cari Maison", "16 EUR", "Yellow curry, crispy chicken, pumpkin, rice, mango, basil"],
          ["Duck Umami", "18 EUR", "Crispy duck, vegetables, coriander, umami x miso"],
          ["Pad Thai", "17 EUR", "Fried flat rice noodles, prawn, egg, pak choi, sprouts, peanuts"],
          ["Veggie Option x Tofu", "-2 EUR", "Available for selected main dishes"],
        ],
      },
    ],
  },
  {
    title: "Maison x Green",
    groups: [
      {
        items: [
          ["Stuffed Tofu", "9 EUR", "Grilled tofu, vegetables, mushroom, sprouts, yardlong beans"],
          ["Fungi Forest", "9.5 EUR", "Bio tofu, king oyster, shiitake, chanterelle, vegan butter x sake"],
          ["Wild Broccolini", "8.5 EUR", "Grilled broccoli, carrot puree, crispy tapioca, soy x garlic"],
          ["Nappa Cabbage", "8 EUR", "Cabbage rolls, shiitake, tofu, scallion, soy sauce"],
          ["Grilled Eggplant", "9 EUR", "Grilled eggplant, scallion, peanuts, coriander, bonito, miso"],
        ],
      },
    ],
  },
  {
    title: "Kai x Grill Special",
    groups: [
      {
        items: [
          ["Salmon Organic", "20 EUR", "Salmon filet, grilled asparagus, carrot puree, salmon roe, miso"],
          ["Ducking Orange", "21 EUR", "Duck filet, peas, baby carrots, sweet potato puree, orange sauce"],
          ["Mais Chicken Teriyaki", "19 EUR", "Boneless chicken thigh, yardlong bean, baby corn, teriyaki"],
          ["Rib Eye Yondu", "23 EUR", "Ribeye steak, tomato, baby broccoli, sweet potato puree, yondu"],
          ["Filet de Boeuf", "26 EUR", "Beef tenderloin, asparagus, mushrooms, sweet potato fries"],
        ],
      },
    ],
  },
  {
    title: "Desserts",
    groups: [
      {
        items: [
          ["Tiramisu Matcha", "6.5 EUR", "Green tea, matcha, vanilla"],
          ["Creme Brulee", "6 EUR", "Vanilla, cream, brown sugar"],
          ["Mango Panna Cotta", "5.5 EUR", "Mango, cream, coco x tapioca sauce"],
          ["Che Bi Do", "5.5 EUR", "Hokkaido pumpkin pudding, coconut milk, cane sugar, mungbean"],
        ],
      },
    ],
  },
  {
    title: "Drinks",
    groups: [
      {
        title: "Aperitif",
        items: [
          ["Aperol Spritz", "8 EUR", "Aperol, prosecco, soda, orange"],
          ["Hugo", "8.5 EUR", "St. Germain, cremant, mint, lime"],
          ["Yuzu Sake Spritz", "9 EUR", "Sake, yuzu, prosecco, tonic, lime"],
          ["Tokyo Mule", "11 EUR", "Haku vodka, ginger beer, lime, cucumber"],
        ],
      },
      {
        title: "Signature Cocktails",
        items: [
          ["Pomelo Sour", "11 EUR", "Gin, grapefruit, lime, bitters, egg white"],
          ["44 Club", "12 EUR", "Gin, Chambord, raspberry, lime, aquafaba"],
          ["Goodbye Sadness", "11 EUR", "Haku vodka, passion fruit liqueur, vanilla, champagne"],
          ["Kaigroni", "10.5 EUR", "Gin, Campari, vermouth, orange bitters"],
        ],
      },
      {
        title: "Wine",
        items: [
          ["Cremant De Bordeaux", "5.5 / 25 EUR", "Jean Degaves, brut"],
          ["Herr Mehling Riesling", "5.5 / 25 EUR", "Pfalz, 2022"],
          ["Touraine Sauvignon Blanc", "6 / 28 EUR", "Chateau de la Presle, Loire, 2022"],
          ["Bons Ventos Rose", "5.5 / 25 EUR", "Casa Santos Lima, Lissabon, 2021"],
          ["Darting Cabernet", "6.5 / 32 EUR", "Pfalz, 2016"],
        ],
      },
    ],
  },
];
