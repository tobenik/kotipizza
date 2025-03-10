const { z } = require("zod");

// Define valid dishes and ingredients from the menu
const validDishes = new Set([
  "Diavola",
  "Americana",
  "Pepperoni",
  "Tuplapepperoni",
  "Tonnikala-ananas",
  "Special Opera",
  "Burger",
  "Margherita",
  "Kana-feta-ananas-punasipuli",
  "Kana-pepperoni",
  "Kebab",
  "Mozzarella",
  "Opera",
  "Parmiamo",
  "Pekoni-barbecue",
  "Pepperoni-ananas",
  "Pollo Americana",
  "Poro",
  "Quattro Stagioni",
  "Superseitan",
  "Tropicana",
  "Zorbas",
]);

const validIngredients = new Set([
  "tomaattikastike",
  "Kotipizza-juusto",
  "nduja-makkara",
  "salami",
  "hunaja",
  "Calabrian chili",
  "pepperonimakkara",
  "ananas",
  "Aura-sinihomejuusto",
  "tonnikala",
  "kinkku",
  "cheddarjuustokastike",
  "beef'n'roast-naudanjauheliha",
  "jauheliha",
  "paahdettu pekoni",
  "kebabliha",
  "pariloitu kananpoika",
  "feta",
  "punasipuli",
  "lisäjuusto",
  "mexicana-kastike",
  "jalapeno",
  "rucolanverso",
  "kirsikkatomaatti",
  "parmesaanijuusto",
  "ilmakuivattu porsaanniska",
  "barbecuekastike",
  "savuporo",
  "kantarelli",
  "poropöly",
  "herkkusieni",
  "katkarapu",
  "seitan",
  "keltainen banaanichili",
  "paprika",
  "oliivi",
  "avokado",
  "valkosipulimajoneesi",
  "chilimajoneesi",
  "sour cream -dippi",
  "ranch-dippi",
  "bearnaisedippi",
  "parmesaanidippi",
]);

// Zod schemas for validation
const OrderItemSchema = z.object({
  name: z
    .string()
    .min(1, "Item name is required")
    .refine((name) => validDishes.has(name), {
      message: "Invalid dish name",
      path: ["name"],
    }),
  quantity: z.number().int().positive().default(1),
});

const OrderSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s-]{6,}$/, "Invalid phone number format"),
  address: z
    .string()
    .min(5, "Address is required and must be at least 5 characters"),
  items: z.array(OrderItemSchema).nonempty("At least one item is required"),
});

/**
 * Validates order data using Zod schemas
 * @param {Object} orderData - The order data to validate
 * @returns {Object} - Object with success flag and either validated data or error details
 */
function validateOrder(orderData) {
  const result = OrderSchema.safeParse(orderData);
  return result;
}

module.exports = {
  validateOrder,
  OrderSchema,
  OrderItemSchema,
  validDishes,
  validIngredients,
};
