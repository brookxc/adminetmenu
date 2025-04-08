import mongoose, { Schema, models } from "mongoose"

const MenuItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false, // Changed from required: true to make it optional
      default: "",
    },
    price: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

const MenuCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    items: [MenuItemSchema],
  },
  { timestamps: true },
)

const RestaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: null,
    },
    themeColor: {
      type: String,
      default: "#3B82F6", // Default to blue
    },
    menuCategories: [MenuCategorySchema],
  },
  { timestamps: true },
)

export default models.Restaurant || mongoose.model("Restaurant", RestaurantSchema)

