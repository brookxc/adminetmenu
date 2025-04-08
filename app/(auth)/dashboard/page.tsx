import { connectToDatabase } from "@/lib/mongodb"
import Restaurant from "@/models/Restaurant"
import DashboardStats from "@/components/dashboard-stats"

export default async function DashboardPage() {
  await connectToDatabase()

  // Get restaurant count
  const restaurantCount = await Restaurant.countDocuments({})

  // Get total menu items count across all restaurants
  const restaurants = await Restaurant.find({})
  const menuItemsCount = restaurants.reduce((total, restaurant) => {
    return (
      total +
      restaurant.menuCategories.reduce((categoryTotal, category) => {
        return categoryTotal + category.items.length
      }, 0)
    )
  }, 0)

  // Get category count
  const categoryCount = restaurants.reduce((total, restaurant) => {
    return total + restaurant.menuCategories.length
  }, 0)

  // Get most recent restaurant
  const latestRestaurant =
    restaurants.length > 0
      ? restaurants.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      : null

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your restaurant menu system</p>
      </div>

      <DashboardStats
        restaurantCount={restaurantCount}
        menuItemsCount={menuItemsCount}
        categoryCount={categoryCount}
        latestRestaurant={latestRestaurant ? JSON.parse(JSON.stringify(latestRestaurant)) : null}
      />
    </div>
  )
}
