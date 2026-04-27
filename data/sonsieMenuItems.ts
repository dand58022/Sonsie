export interface SonsieMenuItem {
  id: string
  name: string
  category: string
  demandPeriods: string[]
  linkedInventoryIds: string[]
  inventoryImpact: string
}

export const sonsieMenuItems: SonsieMenuItem[] = [
  {
    id: "MENU-CAESAR",
    name: "Sonsie Caesar",
    category: "Soups & Salads",
    demandPeriods: ["Brunch", "Lunch", "Dinner"],
    linkedInventoryIds: [
      "SON-PROD-ROMAINE",
      "SON-DAIRY-PECORINO",
      "SON-SAUCE-CAESAR",
      "SON-SEAFOOD-BOQUERONES",
      "SON-BAKERY-RUSTIC-BREAD",
    ],
    inventoryImpact: "Medium produce, medium dairy, low bakery",
  },
  {
    id: "MENU-BURRATA",
    name: "Local Burrata",
    category: "Appetizers",
    demandPeriods: ["Brunch", "Lunch", "Dinner"],
    linkedInventoryIds: [
      "SON-DAIRY-BURRATA",
      "SON-PROD-ASPARAGUS",
      "SON-PROD-FAVA-BEANS",
      "SON-PROD-ARUGULA",
      "SON-SAUCE-ARUGULA-PESTO",
      "SON-BAKERY-RUSTIC-BREAD",
    ],
    inventoryImpact: "High dairy, seasonal produce",
  },
  {
    id: "MENU-OYSTERS",
    name: "Island Creek Oysters",
    category: "Raw Bar",
    demandPeriods: ["Brunch", "Lunch", "Dinner", "Private Events"],
    linkedInventoryIds: [
      "SON-SEAFOOD-OYSTER-IC",
      "SON-PROD-LEMON",
      "SON-SAUCE-COCKTAIL",
    ],
    inventoryImpact: "High seafood sensitivity, short shelf life",
  },
  {
    id: "MENU-WAGYU-BURGER",
    name: "Wagyu Burger",
    category: "Sandwiches & Classics",
    demandPeriods: ["Brunch", "Lunch", "Dinner"],
    linkedInventoryIds: [
      "SON-MEAT-WAGYU-PATTY",
      "SON-DAIRY-CHEDDAR",
      "SON-MEAT-BACON",
      "SON-PROD-TOMATO",
      "SON-PROD-ROMAINE",
      "SON-SAUCE-SPECIAL",
      "SON-BAKERY-BRIOCHE-BUN",
    ],
    inventoryImpact: "High meat, bakery, produce",
  },
  {
    id: "MENU-MARGHERITA",
    name: "Margherita Pizza",
    category: "Brick Oven",
    demandPeriods: ["Brunch", "Lunch", "Dinner", "Light Fare"],
    linkedInventoryIds: [
      "SON-BAKERY-PIZZA-DOUGH",
      "SON-DAIRY-MOZZARELLA",
      "SON-SAUCE-SAN-MARZANO",
      "SON-PROD-BASIL",
    ],
    inventoryImpact: "High dough, dairy, sauce",
  },
  {
    id: "MENU-MORTADELLA-PIZZA",
    name: "Mortadella Pizza",
    category: "Brick Oven",
    demandPeriods: ["Lunch", "Dinner"],
    linkedInventoryIds: [
      "SON-BAKERY-PIZZA-DOUGH",
      "SON-MEAT-MORTADELLA",
      "SON-DAIRY-BURRATA",
      "SON-SAUCE-PISTACHIO-PESTO",
      "SON-DAIRY-RICOTTA",
      "SON-DAIRY-PECORINO",
    ],
    inventoryImpact: "High dairy, meat, dough",
  },
  {
    id: "MENU-SHRIMP-SCAMPI",
    name: "Shrimp Scampi",
    category: "Entrees",
    demandPeriods: ["Dinner"],
    linkedInventoryIds: [
      "SON-SEAFOOD-SHRIMP",
      "SON-DRY-LINGUINE",
      "SON-PROD-LEMON",
      "SON-PROD-SPRING-GARLIC",
      "SON-DRY-PANGRATTATO",
    ],
    inventoryImpact: "Seafood, pasta, produce",
  },
  {
    id: "MENU-STEAK-FRITES",
    name: "Steak Frites",
    category: "Entrees",
    demandPeriods: ["Dinner"],
    linkedInventoryIds: [
      "SON-MEAT-NY-STRIP",
      "SON-DAIRY-TRUFFLE-BUTTER",
      "SON-SUPPLY-STEAK-KNIFE",
    ],
    inventoryImpact: "High meat cost, plated service",
  },
  {
    id: "MENU-FRENCH-TOAST",
    name: "French Toast",
    category: "Brunch",
    demandPeriods: ["Brunch"],
    linkedInventoryIds: [
      "SON-BAKERY-PULLMAN",
      "SON-DRY-CORN-FLAKES",
      "SON-DRY-COCONUT",
      "SON-DAIRY-CHANTILLY",
      "SON-DRY-MAPLE-SYRUP",
    ],
    inventoryImpact: "Bakery, dairy, brunch prep",
  },
  {
    id: "MENU-APEROL-SPRITZ",
    name: "Aperol Spritz",
    category: "Bar",
    demandPeriods: ["Brunch", "Bar", "Private Events"],
    linkedInventoryIds: [
      "SON-BAR-APEROL",
      "SON-WINE-PROSECCO",
      "SON-BAR-ORANGE-JUICE",
    ],
    inventoryImpact: "Bar restock and brunch cocktail demand",
  },
]
