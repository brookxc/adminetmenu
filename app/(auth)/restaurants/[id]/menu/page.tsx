import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import Restaurant from "@/models/Restaurant"
import MenuBuilder from "@/components/menu-builder"

export default async function MenuPage({ params }: { params: { id: string } }) {
  await connectToDatabase()
  const restaurant = await Restaurant.findById(params.id)

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{restaurant.name} Menu</h1>
        <p className="text-muted-foreground mt-2">Add categories and menu items to create your digital menu</p>
      </div>

      <MenuBuilder
        restaurantId={params.id}
        initialMenuCategories={JSON.parse(JSON.stringify(restaurant.menuCategories))}
      />
    </div>
  )
}

