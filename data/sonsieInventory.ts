import { sonsieMenuItems } from "./sonsieMenuItems"

export interface InventoryItem {
  id: string
  name: string
  category: "ingredient" | "supply" | "tool"
  subcategory?:
    | "produce"
    | "seafood"
    | "meat"
    | "dairy"
    | "bakery"
    | "dry_goods"
    | "sauce"
    | "bar"
    | "wine"
    | "coffee"
    | "serviceware"
    | "supply"
    | "tool"
    | "equipment"
  quantity: number
  unit: string
  parLevel: number
  reorderPoint: number
  status: "In Stock" | "Low Stock" | "Critical" | "Out of Stock"
  lastUpdated: string
  supplier: string
  unitCost: number
  leadTimeDays?: number
  storageArea?: string
  perishability?: "High" | "Medium" | "Low"
  serviceUse?: string[]
  linkedMenuItems?: string[]
  notes?: string
}

export interface SupplyItem {
  id: string
  name: string
  quantity: number
  unit: string
  parLevel: number
  status: "Good" | "Low" | "Critical"
  lastUpdated: string
}

export interface Order {
  id: string
  orderNumber: string
  supplier: string
  status: "Draft" | "Submitted" | "Received" | "Cancelled"
  items: { itemId: string; name: string; quantity: number; unitCost: number }[]
  totalCost: number
  createdAt: string
  expectedDelivery?: string
  receivedAt?: string
}

export interface AuditLog {
  id: string
  user: string
  action: "Create" | "Update" | "Delete" | "Import" | "Export"
  itemName: string
  oldValue: string
  newValue: string
  timestamp: string
}

export interface ActivityFeed {
  id: string
  user: string
  action: string
  item?: string
  timestamp: string
  type: "update" | "order" | "delivery" | "alert"
}

export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Staff"
  location: string
  avatar?: string
}

export interface Location {
  id: string
  name: string
  address: string
  manager: string
}

export const mockUsers: User[] = [
  { id: "1", name: "SonsieAdmin", email: "admin@sonsie-demo.local", role: "Admin", location: "Back Bay / Newbury Street" },
  { id: "2", name: "Floor Manager", email: "manager@sonsie-demo.local", role: "Manager", location: "Dining Room + Bar" },
  { id: "3", name: "Event Captain", email: "events@sonsie-demo.local", role: "Staff", location: "Private Events" },
]

export const mockLocations: Location[] = [
  { id: "1", name: "Sonsie", address: "327 Newbury St, Boston, MA 02115", manager: "Floor Manager" },
]

export const mockInventory: InventoryItem[] = [
  { id: "SON-PROD-ROMAINE", name: "Romaine Hearts", category: "ingredient", subcategory: "produce", quantity: 18, unit: "case", parLevel: 22, reorderPoint: 12, status: "Low Stock", lastUpdated: "2026-04-25T08:10:00", supplier: "Back Bay Produce", unitCost: 34, leadTimeDays: 1, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Brunch", "Lunch", "Dinner"], linkedMenuItems: ["Sonsie Caesar"], notes: "Lunch and dinner salad anchor." },
  { id: "SON-PROD-BASIL", name: "Fresh Basil", category: "ingredient", subcategory: "produce", quantity: 4, unit: "case", parLevel: 8, reorderPoint: 5, status: "Critical", lastUpdated: "2026-04-25T09:00:00", supplier: "Back Bay Produce", unitCost: 24, leadTimeDays: 1, storageArea: "Walk-In Cooler", perishability: "High", serviceUse: ["Lunch", "Dinner", "Light Fare"], linkedMenuItems: ["Margherita Pizza"], notes: "Pizza garnish and bar garnish crossover." },
  { id: "SON-PROD-LEMON", name: "Lemon", category: "ingredient", subcategory: "produce", quantity: 2, unit: "case", parLevel: 6, reorderPoint: 3, status: "Critical", lastUpdated: "2026-04-25T07:45:00", supplier: "Back Bay Produce", unitCost: 48, leadTimeDays: 1, storageArea: "Prep Area", perishability: "Medium", serviceUse: ["Brunch", "Dinner", "Bar", "Private Events"], linkedMenuItems: ["Island Creek Oysters", "Shrimp Scampi"], notes: "Shared by raw bar and cocktail program." },
  { id: "SON-PROD-ASPARAGUS", name: "Asparagus", category: "ingredient", subcategory: "produce", quantity: 10, unit: "lb", parLevel: 16, reorderPoint: 8, status: "Low Stock", lastUpdated: "2026-04-25T08:35:00", supplier: "Back Bay Produce", unitCost: 5.6, leadTimeDays: 1, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Brunch", "Lunch", "Dinner"], linkedMenuItems: ["Local Burrata"], notes: "Seasonal feature for spring menu." },
  { id: "SON-PROD-FAVA-BEANS", name: "Fava Beans", category: "ingredient", subcategory: "produce", quantity: 6, unit: "lb", parLevel: 10, reorderPoint: 5, status: "Low Stock", lastUpdated: "2026-04-24T17:20:00", supplier: "Back Bay Produce", unitCost: 7.2, leadTimeDays: 1, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Brunch", "Lunch", "Dinner"], linkedMenuItems: ["Local Burrata"] },
  { id: "SON-PROD-ARUGULA", name: "Arugula", category: "ingredient", subcategory: "produce", quantity: 11, unit: "case", parLevel: 14, reorderPoint: 8, status: "Low Stock", lastUpdated: "2026-04-25T08:05:00", supplier: "Back Bay Produce", unitCost: 29, leadTimeDays: 1, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Lunch", "Dinner"], linkedMenuItems: ["Local Burrata"] },
  { id: "SON-PROD-TOMATO", name: "Tomato", category: "ingredient", subcategory: "produce", quantity: 14, unit: "case", parLevel: 18, reorderPoint: 10, status: "Low Stock", lastUpdated: "2026-04-25T08:40:00", supplier: "Back Bay Produce", unitCost: 31, leadTimeDays: 1, storageArea: "Line Cooler", perishability: "Medium", serviceUse: ["Brunch", "Lunch", "Dinner"], linkedMenuItems: ["Wagyu Burger"] },
  { id: "SON-PROD-SPRING-GARLIC", name: "Spring Garlic", category: "ingredient", subcategory: "produce", quantity: 12, unit: "lb", parLevel: 14, reorderPoint: 7, status: "In Stock", lastUpdated: "2026-04-24T15:15:00", supplier: "Back Bay Produce", unitCost: 4.8, leadTimeDays: 1, storageArea: "Prep Area", perishability: "Medium", serviceUse: ["Dinner"], linkedMenuItems: ["Shrimp Scampi"] },
  { id: "SON-SEAFOOD-OYSTER-IC", name: "Island Creek Oysters", category: "ingredient", subcategory: "seafood", quantity: 8, unit: "dozen", parLevel: 12, reorderPoint: 6, status: "Low Stock", lastUpdated: "2026-04-25T09:30:00", supplier: "Boston Seafood Co.", unitCost: 24, leadTimeDays: 1, storageArea: "Walk-In Cooler", perishability: "High", serviceUse: ["Brunch", "Lunch", "Dinner", "Private Events"], linkedMenuItems: ["Island Creek Oysters"], notes: "High weekend dinner and raw bar demand." },
  { id: "SON-SEAFOOD-SHRIMP", name: "Shrimp", category: "ingredient", subcategory: "seafood", quantity: 9, unit: "lb", parLevel: 18, reorderPoint: 10, status: "Critical", lastUpdated: "2026-04-25T08:55:00", supplier: "Boston Seafood Co.", unitCost: 15.5, leadTimeDays: 1, storageArea: "Walk-In Cooler", perishability: "High", serviceUse: ["Dinner", "Private Events"], linkedMenuItems: ["Shrimp Scampi"] },
  { id: "SON-SEAFOOD-SALMON", name: "Salmon Filets", category: "ingredient", subcategory: "seafood", quantity: 14, unit: "lb", parLevel: 16, reorderPoint: 8, status: "In Stock", lastUpdated: "2026-04-24T16:10:00", supplier: "Boston Seafood Co.", unitCost: 18, leadTimeDays: 1, storageArea: "Walk-In Cooler", perishability: "High", serviceUse: ["Dinner"], linkedMenuItems: ["Seared Salmon"] },
  { id: "SON-SEAFOOD-BOQUERONES", name: "Boquerones", category: "ingredient", subcategory: "seafood", quantity: 7, unit: "quart", parLevel: 8, reorderPoint: 4, status: "In Stock", lastUpdated: "2026-04-24T14:30:00", supplier: "Boston Seafood Co.", unitCost: 18, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Lunch", "Dinner"], linkedMenuItems: ["Sonsie Caesar"] },
  { id: "SON-MEAT-WAGYU-PATTY", name: "Wagyu Burger Patties", category: "ingredient", subcategory: "meat", quantity: 26, unit: "each", parLevel: 32, reorderPoint: 18, status: "In Stock", lastUpdated: "2026-04-25T08:00:00", supplier: "Premium Meats Northeast", unitCost: 8.75, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Brunch", "Lunch", "Dinner"], linkedMenuItems: ["Wagyu Burger"] },
  { id: "SON-MEAT-BACON", name: "Thick Cut Bacon", category: "ingredient", subcategory: "meat", quantity: 11, unit: "lb", parLevel: 16, reorderPoint: 8, status: "In Stock", lastUpdated: "2026-04-25T07:50:00", supplier: "Premium Meats Northeast", unitCost: 7.4, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Brunch", "Lunch"], linkedMenuItems: ["Wagyu Burger", "French Toast"] },
  { id: "SON-MEAT-NY-STRIP", name: "NY Strip 12 oz", category: "ingredient", subcategory: "meat", quantity: 10, unit: "each", parLevel: 14, reorderPoint: 8, status: "Low Stock", lastUpdated: "2026-04-25T09:10:00", supplier: "Premium Meats Northeast", unitCost: 22, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Dinner"], linkedMenuItems: ["Steak Frites"] },
  { id: "SON-MEAT-MORTADELLA", name: "Mortadella", category: "ingredient", subcategory: "meat", quantity: 8, unit: "lb", parLevel: 10, reorderPoint: 5, status: "In Stock", lastUpdated: "2026-04-24T13:15:00", supplier: "Premium Meats Northeast", unitCost: 12.8, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Lunch", "Dinner"], linkedMenuItems: ["Mortadella Pizza"] },
  { id: "SON-MEAT-CHORIZO", name: "Hot Chorizo", category: "ingredient", subcategory: "meat", quantity: 5, unit: "lb", parLevel: 8, reorderPoint: 4, status: "In Stock", lastUpdated: "2026-04-24T15:05:00", supplier: "Premium Meats Northeast", unitCost: 9.5, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Lunch", "Dinner", "Bar"], linkedMenuItems: ["Angry Pizza"] },
  { id: "SON-DAIRY-BURRATA", name: "Burrata", category: "ingredient", subcategory: "dairy", quantity: 14, unit: "each", parLevel: 20, reorderPoint: 10, status: "Low Stock", lastUpdated: "2026-04-25T08:25:00", supplier: "New England Dairy & Cheese", unitCost: 6.8, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "High", serviceUse: ["Brunch", "Lunch", "Dinner"], linkedMenuItems: ["Local Burrata", "Mortadella Pizza"] },
  { id: "SON-DAIRY-MOZZARELLA", name: "Fresh Mozzarella", category: "ingredient", subcategory: "dairy", quantity: 18, unit: "lb", parLevel: 24, reorderPoint: 12, status: "Low Stock", lastUpdated: "2026-04-25T08:15:00", supplier: "New England Dairy & Cheese", unitCost: 5.4, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "High", serviceUse: ["Lunch", "Dinner", "Light Fare"], linkedMenuItems: ["Margherita Pizza"] },
  { id: "SON-DAIRY-PECORINO", name: "Pecorino", category: "ingredient", subcategory: "dairy", quantity: 9, unit: "lb", parLevel: 12, reorderPoint: 6, status: "In Stock", lastUpdated: "2026-04-24T16:00:00", supplier: "New England Dairy & Cheese", unitCost: 10.5, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Brunch", "Lunch", "Dinner"], linkedMenuItems: ["Sonsie Caesar", "Mortadella Pizza"] },
  { id: "SON-DAIRY-RICOTTA", name: "Ricotta", category: "ingredient", subcategory: "dairy", quantity: 7, unit: "quart", parLevel: 8, reorderPoint: 4, status: "In Stock", lastUpdated: "2026-04-24T12:10:00", supplier: "New England Dairy & Cheese", unitCost: 11, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Lunch", "Dinner"], linkedMenuItems: ["Mortadella Pizza"] },
  { id: "SON-DAIRY-CHEDDAR", name: "Vermont Cheddar", category: "ingredient", subcategory: "dairy", quantity: 10, unit: "lb", parLevel: 12, reorderPoint: 6, status: "In Stock", lastUpdated: "2026-04-24T15:40:00", supplier: "New England Dairy & Cheese", unitCost: 8.9, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Brunch", "Lunch", "Dinner"], linkedMenuItems: ["Wagyu Burger"] },
  { id: "SON-DAIRY-CHANTILLY", name: "Chantilly Cream", category: "ingredient", subcategory: "dairy", quantity: 6, unit: "quart", parLevel: 8, reorderPoint: 4, status: "In Stock", lastUpdated: "2026-04-24T11:25:00", supplier: "New England Dairy & Cheese", unitCost: 9.2, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "High", serviceUse: ["Brunch"], linkedMenuItems: ["French Toast"] },
  { id: "SON-DAIRY-TRUFFLE-BUTTER", name: "Black Truffle Compound Butter", category: "ingredient", subcategory: "dairy", quantity: 5, unit: "quart", parLevel: 6, reorderPoint: 3, status: "In Stock", lastUpdated: "2026-04-24T13:50:00", supplier: "New England Dairy & Cheese", unitCost: 16.4, leadTimeDays: 2, storageArea: "Walk-In Cooler", perishability: "Medium", serviceUse: ["Dinner"], linkedMenuItems: ["Steak Frites"] },
  { id: "SON-BAKERY-PIZZA-DOUGH", name: "Brick Oven Pizza Dough", category: "ingredient", subcategory: "bakery", quantity: 26, unit: "tray", parLevel: 40, reorderPoint: 24, status: "Low Stock", lastUpdated: "2026-04-25T06:30:00", supplier: "Artisan Bread & Dough", unitCost: 38, leadTimeDays: 1, storageArea: "Brick Oven Station", perishability: "Medium", serviceUse: ["Brunch", "Lunch", "Dinner", "Light Fare", "Private Events"], linkedMenuItems: ["Margherita Pizza", "Mortadella Pizza"], notes: "Weekend brick oven prep increased." },
  { id: "SON-BAKERY-BRIOCHE-BUN", name: "Brioche Burger Buns", category: "ingredient", subcategory: "bakery", quantity: 30, unit: "each", parLevel: 36, reorderPoint: 18, status: "In Stock", lastUpdated: "2026-04-24T14:05:00", supplier: "Artisan Bread & Dough", unitCost: 1.4, leadTimeDays: 1, storageArea: "Dry Storage", perishability: "Medium", serviceUse: ["Lunch", "Dinner"], linkedMenuItems: ["Wagyu Burger"] },
  { id: "SON-BAKERY-RUSTIC-BREAD", name: "Toasted Rustic Bread", category: "ingredient", subcategory: "bakery", quantity: 20, unit: "loaf", parLevel: 24, reorderPoint: 12, status: "In Stock", lastUpdated: "2026-04-24T13:00:00", supplier: "Artisan Bread & Dough", unitCost: 4.2, leadTimeDays: 1, storageArea: "Dry Storage", perishability: "Medium", serviceUse: ["Brunch", "Lunch", "Dinner"], linkedMenuItems: ["Sonsie Caesar", "Local Burrata"] },
  { id: "SON-BAKERY-PULLMAN", name: "White Pullman Bread", category: "ingredient", subcategory: "bakery", quantity: 9, unit: "loaf", parLevel: 12, reorderPoint: 6, status: "In Stock", lastUpdated: "2026-04-24T11:10:00", supplier: "Artisan Bread & Dough", unitCost: 3.9, leadTimeDays: 1, storageArea: "Dry Storage", perishability: "Medium", serviceUse: ["Brunch"], linkedMenuItems: ["French Toast"] },
  { id: "SON-DRY-LINGUINE", name: "Linguine", category: "ingredient", subcategory: "dry_goods", quantity: 18, unit: "case", parLevel: 16, reorderPoint: 8, status: "In Stock", lastUpdated: "2026-04-22T14:20:00", supplier: "Restaurant Depot Mock Vendor", unitCost: 28, leadTimeDays: 4, storageArea: "Dry Storage", perishability: "Low", serviceUse: ["Dinner"], linkedMenuItems: ["Shrimp Scampi"] },
  { id: "SON-DRY-PANGRATTATO", name: "Pangrattato", category: "ingredient", subcategory: "dry_goods", quantity: 6, unit: "batch", parLevel: 6, reorderPoint: 3, status: "In Stock", lastUpdated: "2026-04-24T10:30:00", supplier: "Restaurant Depot Mock Vendor", unitCost: 7.5, leadTimeDays: 3, storageArea: "Pantry Station", perishability: "Low", serviceUse: ["Dinner"], linkedMenuItems: ["Shrimp Scampi"] },
  { id: "SON-DRY-CORN-FLAKES", name: "Corn Flakes", category: "ingredient", subcategory: "dry_goods", quantity: 7, unit: "box", parLevel: 8, reorderPoint: 4, status: "In Stock", lastUpdated: "2026-04-24T09:20:00", supplier: "Restaurant Depot Mock Vendor", unitCost: 4.8, leadTimeDays: 3, storageArea: "Dry Storage", perishability: "Low", serviceUse: ["Brunch"], linkedMenuItems: ["French Toast"] },
  { id: "SON-DRY-COCONUT", name: "Coconut", category: "ingredient", subcategory: "dry_goods", quantity: 6, unit: "bag", parLevel: 6, reorderPoint: 3, status: "In Stock", lastUpdated: "2026-04-24T09:25:00", supplier: "Restaurant Depot Mock Vendor", unitCost: 5.4, leadTimeDays: 3, storageArea: "Dry Storage", perishability: "Low", serviceUse: ["Brunch"], linkedMenuItems: ["French Toast"] },
  { id: "SON-DRY-MAPLE-SYRUP", name: "Maple Syrup", category: "ingredient", subcategory: "dry_goods", quantity: 8, unit: "bottle", parLevel: 10, reorderPoint: 5, status: "In Stock", lastUpdated: "2026-04-24T09:40:00", supplier: "Restaurant Depot Mock Vendor", unitCost: 8.6, leadTimeDays: 3, storageArea: "Pantry Station", perishability: "Low", serviceUse: ["Brunch"], linkedMenuItems: ["French Toast"] },
  { id: "SON-SAUCE-CAESAR", name: "Creamy Caesar Dressing", category: "ingredient", subcategory: "sauce", quantity: 5, unit: "quart", parLevel: 8, reorderPoint: 4, status: "In Stock", lastUpdated: "2026-04-24T12:00:00", supplier: "Restaurant Depot Mock Vendor", unitCost: 9.5, leadTimeDays: 3, storageArea: "Pantry Station", perishability: "Medium", serviceUse: ["Lunch", "Dinner"], linkedMenuItems: ["Sonsie Caesar"] },
  { id: "SON-SAUCE-ARUGULA-PESTO", name: "Arugula Pesto", category: "ingredient", subcategory: "sauce", quantity: 4, unit: "quart", parLevel: 6, reorderPoint: 3, status: "In Stock", lastUpdated: "2026-04-24T11:50:00", supplier: "Restaurant Depot Mock Vendor", unitCost: 11.5, leadTimeDays: 3, storageArea: "Pantry Station", perishability: "Medium", serviceUse: ["Brunch", "Lunch", "Dinner"], linkedMenuItems: ["Local Burrata"] },
  { id: "SON-SAUCE-SAN-MARZANO", name: "San Marzano Tomato Sauce", category: "ingredient", subcategory: "sauce", quantity: 12, unit: "quart", parLevel: 14, reorderPoint: 7, status: "In Stock", lastUpdated: "2026-04-24T12:20:00", supplier: "Restaurant Depot Mock Vendor", unitCost: 10.5, leadTimeDays: 3, storageArea: "Brick Oven Station", perishability: "Medium", serviceUse: ["Lunch", "Dinner", "Light Fare"], linkedMenuItems: ["Margherita Pizza", "Mortadella Pizza"] },
  { id: "SON-SAUCE-PISTACHIO-PESTO", name: "Pistachio Pesto", category: "ingredient", subcategory: "sauce", quantity: 3, unit: "quart", parLevel: 5, reorderPoint: 2, status: "In Stock", lastUpdated: "2026-04-24T12:25:00", supplier: "Restaurant Depot Mock Vendor", unitCost: 13.2, leadTimeDays: 3, storageArea: "Pantry Station", perishability: "Medium", serviceUse: ["Lunch", "Dinner"], linkedMenuItems: ["Mortadella Pizza"] },
  { id: "SON-SAUCE-SPECIAL", name: "Special Sauce", category: "ingredient", subcategory: "sauce", quantity: 5, unit: "quart", parLevel: 6, reorderPoint: 3, status: "In Stock", lastUpdated: "2026-04-24T11:35:00", supplier: "Restaurant Depot Mock Vendor", unitCost: 8.1, leadTimeDays: 3, storageArea: "Line Cooler", perishability: "Medium", serviceUse: ["Lunch", "Dinner"], linkedMenuItems: ["Wagyu Burger"] },
  { id: "SON-SAUCE-COCKTAIL", name: "Cocktail Sauce", category: "ingredient", subcategory: "sauce", quantity: 4, unit: "quart", parLevel: 5, reorderPoint: 2, status: "In Stock", lastUpdated: "2026-04-24T10:45:00", supplier: "Restaurant Depot Mock Vendor", unitCost: 7.8, leadTimeDays: 3, storageArea: "Pantry Station", perishability: "Medium", serviceUse: ["Brunch", "Lunch", "Dinner", "Private Events"], linkedMenuItems: ["Island Creek Oysters"] },
  { id: "SON-BAR-APEROL", name: "Aperol", category: "ingredient", subcategory: "bar", quantity: 9, unit: "bottle", parLevel: 12, reorderPoint: 6, status: "In Stock", lastUpdated: "2026-04-24T21:10:00", supplier: "Beverage & Wine Distributor", unitCost: 27, leadTimeDays: 4, storageArea: "Bar Storage", perishability: "Low", serviceUse: ["Brunch", "Bar", "Private Events"], linkedMenuItems: ["Aperol Spritz"] },
  { id: "SON-BAR-ORANGE-JUICE", name: "Orange Juice", category: "ingredient", subcategory: "bar", quantity: 6, unit: "gallon", parLevel: 10, reorderPoint: 5, status: "Low Stock", lastUpdated: "2026-04-25T07:20:00", supplier: "Beverage & Wine Distributor", unitCost: 12, leadTimeDays: 2, storageArea: "Bar Storage", perishability: "Medium", serviceUse: ["Brunch", "Bar"], linkedMenuItems: ["Aperol Spritz"] },
  { id: "SON-WINE-PROSECCO", name: "Prosecco", category: "ingredient", subcategory: "wine", quantity: 22, unit: "bottle", parLevel: 20, reorderPoint: 10, status: "In Stock", lastUpdated: "2026-04-24T20:50:00", supplier: "Beverage & Wine Distributor", unitCost: 19, leadTimeDays: 4, storageArea: "Wine Room", perishability: "Low", serviceUse: ["Brunch", "Bar", "Private Events"], linkedMenuItems: ["Aperol Spritz"] },
  { id: "SON-WINE-PINOT-NOIR", name: "Pinot Noir", category: "ingredient", subcategory: "wine", quantity: 18, unit: "bottle", parLevel: 18, reorderPoint: 8, status: "In Stock", lastUpdated: "2026-04-24T20:40:00", supplier: "Beverage & Wine Distributor", unitCost: 26, leadTimeDays: 4, storageArea: "Wine Room", perishability: "Low", serviceUse: ["Dinner", "Bar", "Private Events"] },
  { id: "SON-COFFEE-BEANS", name: "Espresso Beans", category: "ingredient", subcategory: "coffee", quantity: 4, unit: "bag", parLevel: 6, reorderPoint: 3, status: "In Stock", lastUpdated: "2026-04-24T18:25:00", supplier: "Cafe Supply Co.", unitCost: 18.5, leadTimeDays: 3, storageArea: "Coffee Station", perishability: "Low", serviceUse: ["Brunch", "Lunch", "Cafe", "Bar"] },
  { id: "SON-COFFEE-OAT-MILK", name: "Oat Milk", category: "ingredient", subcategory: "coffee", quantity: 8, unit: "carton", parLevel: 10, reorderPoint: 5, status: "In Stock", lastUpdated: "2026-04-24T18:10:00", supplier: "Cafe Supply Co.", unitCost: 4.2, leadTimeDays: 3, storageArea: "Coffee Station", perishability: "Medium", serviceUse: ["Brunch", "Lunch", "Cafe"] },
  { id: "SON-SUPPLY-LINEN-NAPKIN", name: "Linen Napkins", category: "supply", subcategory: "supply", quantity: 340, unit: "each", parLevel: 480, reorderPoint: 360, status: "Critical", lastUpdated: "2026-04-25T07:30:00", supplier: "Restaurant Paper Supply", unitCost: 1.1, leadTimeDays: 5, storageArea: "Dish / Service Storage", perishability: "Low", serviceUse: ["Lunch", "Dinner", "Private Events"] },
  { id: "SON-SUPPLY-WINE-GLASS", name: "Wine Glasses", category: "supply", subcategory: "serviceware", quantity: 96, unit: "each", parLevel: 132, reorderPoint: 90, status: "In Stock", lastUpdated: "2026-04-24T23:20:00", supplier: "Restaurant Paper Supply", unitCost: 3.8, leadTimeDays: 5, storageArea: "Dish / Service Storage", perishability: "Low", serviceUse: ["Dinner", "Bar", "Private Events"] },
  { id: "SON-SUPPLY-PIZZA-BOX", name: "Pizza Boxes", category: "supply", subcategory: "supply", quantity: 80, unit: "each", parLevel: 120, reorderPoint: 60, status: "In Stock", lastUpdated: "2026-04-24T15:55:00", supplier: "Restaurant Paper Supply", unitCost: 0.9, leadTimeDays: 5, storageArea: "Private Event Storage", perishability: "Low", serviceUse: ["Light Fare", "Private Events"] },
  { id: "SON-SUPPLY-COFFEE-CUP", name: "Coffee Cups", category: "supply", subcategory: "supply", quantity: 220, unit: "each", parLevel: 260, reorderPoint: 140, status: "In Stock", lastUpdated: "2026-04-24T17:40:00", supplier: "Cafe Supply Co.", unitCost: 0.24, leadTimeDays: 3, storageArea: "Coffee Station", perishability: "Low", serviceUse: ["Brunch", "Lunch", "Cafe"] },
  { id: "SON-TOOL-BRICK-OVEN-PEEL", name: "Brick Oven Peel", category: "tool", subcategory: "tool", quantity: 3, unit: "each", parLevel: 4, reorderPoint: 2, status: "In Stock", lastUpdated: "2026-04-24T16:30:00", supplier: "Restaurant Paper Supply", unitCost: 42, leadTimeDays: 5, storageArea: "Brick Oven Station", perishability: "Low" },
  { id: "SON-TOOL-OYSTER-KNIFE", name: "Oyster Knife", category: "tool", subcategory: "tool", quantity: 6, unit: "each", parLevel: 8, reorderPoint: 4, status: "In Stock", lastUpdated: "2026-04-24T19:10:00", supplier: "Restaurant Paper Supply", unitCost: 18, leadTimeDays: 5, storageArea: "Pantry Station", perishability: "Low" },
  { id: "SON-TOOL-BAR-SHAKER", name: "Bar Shaker", category: "tool", subcategory: "tool", quantity: 7, unit: "each", parLevel: 8, reorderPoint: 4, status: "In Stock", lastUpdated: "2026-04-24T20:30:00", supplier: "Restaurant Paper Supply", unitCost: 14, leadTimeDays: 5, storageArea: "Bar Storage", perishability: "Low" },
  { id: "SON-TOOL-LABEL-PRINTER", name: "Label Printer", category: "tool", subcategory: "equipment", quantity: 1, unit: "each", parLevel: 1, reorderPoint: 1, status: "In Stock", lastUpdated: "2026-04-23T14:40:00", supplier: "Restaurant Paper Supply", unitCost: 95, leadTimeDays: 5, storageArea: "Prep Area", perishability: "Low" },
]

export const mockSupplies: SupplyItem[] = [
  { id: "s1", name: "Linen Napkins", quantity: 340, unit: "each", parLevel: 480, status: "Critical", lastUpdated: "2026-04-25T07:30:00" },
  { id: "s2", name: "Wine Glasses", quantity: 96, unit: "each", parLevel: 132, status: "Good", lastUpdated: "2026-04-24T23:20:00" },
  { id: "s3", name: "Pizza Boxes", quantity: 80, unit: "each", parLevel: 120, status: "Good", lastUpdated: "2026-04-24T15:55:00" },
  { id: "s4", name: "Coffee Cups", quantity: 220, unit: "each", parLevel: 260, status: "Good", lastUpdated: "2026-04-24T17:40:00" },
  { id: "s5", name: "Cocktail Napkins", quantity: 420, unit: "each", parLevel: 500, status: "Low", lastUpdated: "2026-04-24T18:35:00" },
  { id: "s6", name: "Oyster Forks", quantity: 160, unit: "each", parLevel: 200, status: "Low", lastUpdated: "2026-04-24T19:00:00" },
]

export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "PO-2026-0424",
    supplier: "Boston Seafood Co.",
    status: "Submitted",
    items: [
      { itemId: "SON-SEAFOOD-OYSTER-IC", name: "Island Creek Oysters", quantity: 10, unitCost: 24 },
      { itemId: "SON-SEAFOOD-SHRIMP", name: "Shrimp", quantity: 12, unitCost: 15.5 },
    ],
    totalCost: 426,
    createdAt: "2026-04-24T15:10:00",
    expectedDelivery: "2026-04-26T08:00:00",
  },
  {
    id: "2",
    orderNumber: "PO-2026-0425",
    supplier: "Back Bay Produce",
    status: "Draft",
    items: [
      { itemId: "SON-PROD-BASIL", name: "Fresh Basil", quantity: 6, unitCost: 24 },
      { itemId: "SON-PROD-LEMON", name: "Lemon", quantity: 4, unitCost: 48 },
    ],
    totalCost: 336,
    createdAt: "2026-04-25T09:25:00",
  },
  {
    id: "3",
    orderNumber: "PO-2026-0423",
    supplier: "New England Dairy & Cheese",
    status: "Received",
    items: [
      { itemId: "SON-DAIRY-BURRATA", name: "Burrata", quantity: 18, unitCost: 6.8 },
      { itemId: "SON-DAIRY-MOZZARELLA", name: "Fresh Mozzarella", quantity: 18, unitCost: 5.4 },
    ],
    totalCost: 219.6,
    createdAt: "2026-04-23T11:00:00",
    expectedDelivery: "2026-04-25T07:30:00",
    receivedAt: "2026-04-25T07:20:00",
  },
  {
    id: "4",
    orderNumber: "PO-2026-0422",
    supplier: "Beverage & Wine Distributor",
    status: "Received",
    items: [
      { itemId: "SON-BAR-APEROL", name: "Aperol", quantity: 6, unitCost: 27 },
      { itemId: "SON-WINE-PROSECCO", name: "Prosecco", quantity: 12, unitCost: 19 },
    ],
    totalCost: 390,
    createdAt: "2026-04-22T13:30:00",
    expectedDelivery: "2026-04-24T10:00:00",
    receivedAt: "2026-04-24T10:05:00",
  },
]

export const mockAuditLogs: AuditLog[] = [
  { id: "1", user: "SonsieAdmin", action: "Update", itemName: "Island Creek Oysters", oldValue: "10 dozen", newValue: "8 dozen", timestamp: "2026-04-25T09:30:00" },
  { id: "2", user: "Floor Manager", action: "Import", itemName: "Daily Sales Mix CSV", oldValue: "-", newValue: "64 menu lines reviewed", timestamp: "2026-04-25T08:00:00" },
  { id: "3", user: "Event Captain", action: "Update", itemName: "Linen Napkins", oldValue: "420 each", newValue: "340 each", timestamp: "2026-04-25T07:30:00" },
  { id: "4", user: "SonsieAdmin", action: "Create", itemName: "PO-2026-0425", oldValue: "-", newValue: "Draft vendor order created", timestamp: "2026-04-25T09:25:00" },
  { id: "5", user: "Floor Manager", action: "Update", itemName: "Brick Oven Pizza Dough", oldValue: "22 tray", newValue: "26 tray", timestamp: "2026-04-25T06:30:00" },
  { id: "6", user: "SonsieAdmin", action: "Export", itemName: "Weekend Service Review", oldValue: "-", newValue: "sonsie-weekend-review.pdf", timestamp: "2026-04-24T17:30:00" },
]

export const mockActivityFeed: ActivityFeed[] = [
  { id: "1", user: "Floor Manager", action: "marked critical before dinner service", item: "Island Creek Oysters", timestamp: "2026-04-25T09:30:00", type: "alert" },
  { id: "2", user: "System", action: "flagged brunch cocktail demand for", item: "Aperol and Prosecco", timestamp: "2026-04-25T08:45:00", type: "order" },
  { id: "3", user: "SonsieAdmin", action: "received delivery from", item: "New England Dairy & Cheese", timestamp: "2026-04-25T07:20:00", type: "delivery" },
  { id: "4", user: "Event Captain", action: "updated service count for", item: "Wine Glasses", timestamp: "2026-04-24T23:20:00", type: "update" },
  { id: "5", user: "System", action: "raised weekend prep for", item: "Brick Oven Pizza Dough", timestamp: "2026-04-24T22:10:00", type: "alert" },
]

export const usageChartData = [
  { date: "04/19", produce: 56, seafood: 30, bar: 24 },
  { date: "04/20", produce: 62, seafood: 34, bar: 26 },
  { date: "04/21", produce: 58, seafood: 28, bar: 22 },
  { date: "04/22", produce: 64, seafood: 32, bar: 24 },
  { date: "04/23", produce: 70, seafood: 38, bar: 30 },
  { date: "04/24", produce: 76, seafood: 42, bar: 36 },
  { date: "04/25", produce: 74, seafood: 40, bar: 38 },
]

export const forecastData = [
  { week: "Week 16", projected: 2380, actual: 2320 },
  { week: "Week 17", projected: 2520, actual: 2475 },
  { week: "Week 18", projected: 2680, actual: 2610 },
  { week: "Week 19", projected: 2860, actual: null },
  { week: "Week 20", projected: 3010, actual: null },
  { week: "Week 21", projected: 2880, actual: null },
]

export const kpiData = {
  totalInventoryValue: 36840,
  lowStockItems: 11,
  pendingOrders: 2,
  todayUsage: 152,
  inventoryValueChange: 5.4,
  lowStockChange: 2,
  pendingOrdersChange: 1,
  usageChange: 11.8,
}

export const kitchenReadiness = {
  itemsAbovePar: 68,
  criticalShortages: 5,
  prepStatus: "Ready" as const,
}

export const reorderRecommendations = [
  { item: mockInventory[8], currentQty: 8, recommendedQty: 10, urgency: "Critical" as const },
  { item: mockInventory[9], currentQty: 9, recommendedQty: 12, urgency: "Critical" as const },
  { item: mockInventory[1], currentQty: 4, recommendedQty: 6, urgency: "Critical" as const },
  { item: mockInventory[25], currentQty: 9, recommendedQty: 6, urgency: "High" as const },
]

export function getStatusColor(status: InventoryItem["status"]) {
  switch (status) {
    case "In Stock":
      return "bg-success/10 text-success border-success/20"
    case "Low Stock":
      return "bg-warning/10 text-warning border-warning/20"
    case "Critical":
      return "bg-destructive/10 text-destructive border-destructive/20"
    case "Out of Stock":
      return "bg-destructive/20 text-destructive border-destructive/30"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function getInventoryCategoryLabel(category: InventoryItem["category"]) {
  switch (category) {
    case "ingredient":
      return "Inventory"
    case "supply":
      return "Supplies"
    case "tool":
      return "Tools"
  }
}

export function getInventorySubcategoryLabel(subcategory: InventoryItem["subcategory"]) {
  switch (subcategory) {
    case "produce":
      return "Produce"
    case "seafood":
      return "Seafood"
    case "meat":
      return "Meat"
    case "dairy":
      return "Dairy"
    case "bakery":
      return "Bakery"
    case "dry_goods":
      return "Dry Goods"
    case "sauce":
      return "Sauces"
    case "bar":
      return "Bar"
    case "wine":
      return "Wine"
    case "coffee":
      return "Coffee"
    case "serviceware":
      return "Serviceware"
    case "supply":
      return "Supplies"
    case "tool":
      return "Tool"
    case "equipment":
      return "Equipment"
    default:
      return "General"
  }
}

export function getSupplyStatusColor(status: SupplyItem["status"]) {
  switch (status) {
    case "Good":
      return "bg-success/10 text-success border-success/20"
    case "Low":
      return "bg-warning/10 text-warning border-warning/20"
    case "Critical":
      return "bg-destructive/10 text-destructive border-destructive/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function getOrderStatusColor(status: Order["status"]) {
  switch (status) {
    case "Draft":
      return "bg-muted text-muted-foreground border-border"
    case "Submitted":
      return "bg-chart-2/10 text-chart-2 border-chart-2/20"
    case "Received":
      return "bg-success/10 text-success border-success/20"
    case "Cancelled":
      return "bg-destructive/10 text-destructive border-destructive/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function getUrgencyColor(urgency: "Critical" | "High" | "Medium" | "Low") {
  switch (urgency) {
    case "Critical":
      return "bg-destructive/10 text-destructive border-destructive/20"
    case "High":
      return "bg-primary/10 text-primary border-primary/20"
    case "Medium":
      return "bg-warning/10 text-warning border-warning/20"
    case "Low":
      return "bg-muted text-muted-foreground border-border"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export const sonsieMenuMap = Object.fromEntries(sonsieMenuItems.map((item) => [item.name, item]))
