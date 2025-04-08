"use client"

import Image from "next/image"
import { MapPin } from "lucide-react"

type MenuPreviewProps = {
  restaurantInfo: {
    name: string
    logo: string | null
    location: string
    description?: string
    themeColor?: string
  }
  menuData: Array<{
    name: string
    items: Array<{
      name: string
      description: string
      price: string
      image: string | null
    }>
  }>
}

export default function MenuPreview({ restaurantInfo, menuData }: MenuPreviewProps) {
  const themeColor = restaurantInfo.themeColor || "#3B82F6"

  // Generate lighter version of theme color for background
  const hexToRgba = (hex: string, alpha = 0.1) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)
    if (!result) return `rgba(59, 130, 246, ${alpha})`

    const r = Number.parseInt(result[1], 16)
    const g = Number.parseInt(result[2], 16)
    const b = Number.parseInt(result[3], 16)

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const bgColor = hexToRgba(themeColor, 0.1)

  return (
    <div className="mx-auto max-w-4xl bg-white rounded-lg overflow-hidden shadow-lg">
      {/* Restaurant Header */}
      <div className="p-6 flex flex-col items-center text-center" style={{ backgroundColor: bgColor }}>
        {restaurantInfo.logo && (
          <div
            className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md mb-4"
            style={{ borderColor: themeColor }}
          >
            <Image
              src={restaurantInfo.logo || "/placeholder.svg"}
              alt={`${restaurantInfo.name} logo`}
              fill
              className="object-cover"
            />
          </div>
        )}

        <h1 className="text-2xl font-bold" style={{ color: themeColor }}>
          {restaurantInfo.name}
        </h1>

        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {restaurantInfo.location}
        </div>

        {restaurantInfo.description && <p className="mt-4 text-sm max-w-md">{restaurantInfo.description}</p>}
      </div>

      {/* Menu Categories */}
      <div className="p-6">
        {menuData.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            No menu items added yet. Use the Menu Builder to add categories and items.
          </div>
        ) : (
          <div className="space-y-10">
            {menuData.map((category, index) => (
              <div key={index}>
                <h2
                  className="text-xl font-semibold pb-2 mb-4 border-b"
                  style={{ borderColor: bgColor, color: themeColor }}
                >
                  {category.name}
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-4">
                      {item.image && (
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="font-medium" style={{ color: themeColor }}>
                            {item.price} Birr
                          </div>
                        </div>
                        {item.description && (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

