"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Edit, Trash2, ExternalLink, Search, Loader2, Palette, QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import SimpleQRCode from "./simple-qr-code"

type Restaurant = {
  _id: string
  name: string
  location: string
  description: string
  logo: string | null
  themeColor?: string
}

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingRestaurantId, setLoadingRestaurantId] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<"edit" | "menu" | null>(null)
  const [qrCodeRestaurant, setQrCodeRestaurant] = useState<{ id: string; name: string } | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/restaurants")

      if (!response.ok) {
        throw new Error(`Failed to fetch restaurants: ${response.status}`)
      }

      const data = await response.json()

      // Ensure we have an array even if the API returns null or undefined
      const restaurantsData = Array.isArray(data) ? data : []
      setRestaurants(restaurantsData)
      setFilteredRestaurants(restaurantsData)
    } catch (error) {
      console.error("Error fetching restaurants:", error)
      setRestaurants([])
      setFilteredRestaurants([])
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load restaurants",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchRestaurants()
  }, [fetchRestaurants])

  useEffect(() => {
    if (!restaurants || searchQuery.trim() === "") {
      setFilteredRestaurants(restaurants || [])
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = restaurants.filter(
        (restaurant) =>
          (restaurant.name?.toLowerCase() || "").includes(query) ||
          (restaurant.location?.toLowerCase() || "").includes(query) ||
          (restaurant.description || "").toLowerCase().includes(query),
      )
      setFilteredRestaurants(filtered)
    }
  }, [searchQuery, restaurants])

  const deleteRestaurant = async (id: string) => {
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const updatedRestaurants = restaurants.filter((restaurant) => restaurant._id !== id)
        setRestaurants(updatedRestaurants)
        setFilteredRestaurants(filteredRestaurants.filter((restaurant) => restaurant._id !== id))
        toast({
          title: "Success",
          description: "Restaurant deleted successfully",
        })
      } else {
        throw new Error("Failed to delete restaurant")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete restaurant",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (id: string) => {
    setLoadingRestaurantId(id)
    setLoadingAction("edit")
    router.push(`/restaurants/${id}/edit`)
  }

  const handleManageMenuClick = (id: string) => {
    setLoadingRestaurantId(id)
    setLoadingAction("menu")
    router.push(`/restaurants/${id}/menu`)
  }

  const handleQRCodeClick = (id: string, name: string) => {
    try {
      setQrCodeRestaurant({ id, name })
    } catch (error) {
      console.error("Error opening QR code dialog:", error)
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isLoading = (id: string, action: "edit" | "menu") => {
    return loadingRestaurantId === id && loadingAction === action
  }

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Loading restaurants...</p>
        </div>
      ) : !filteredRestaurants || filteredRestaurants.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">
            {searchQuery.trim() !== ""
              ? "No restaurants match your search criteria."
              : "No restaurants added yet. Create your first restaurant using the 'Add New Restaurant' tab."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant._id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  {restaurant.logo && (
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      <Image
                        src={restaurant.logo || "/placeholder.svg"}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                    <CardDescription>{restaurant.location}</CardDescription>
                  </div>
                  {restaurant.themeColor && (
                    <div
                      className="h-6 w-6 rounded-full border flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: restaurant.themeColor }}
                      title="Theme Color"
                    >
                      <Palette className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {restaurant.description || "No description provided."}
                </p>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <div className="flex gap-2 flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(restaurant._id)}
                    disabled={isLoading(restaurant._id, "edit")}
                  >
                    {isLoading(restaurant._id, "edit") ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </>
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the restaurant and all its menu data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteRestaurant(restaurant._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQRCodeClick(restaurant._id, restaurant.name)}
                  >
                    <QrCode className="h-4 w-4 mr-1" />
                    QR Code
                  </Button>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleManageMenuClick(restaurant._id)}
                  disabled={isLoading(restaurant._id, "menu")}
                >
                  {isLoading(restaurant._id, "menu") ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Manage Menu
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {qrCodeRestaurant && (
        <SimpleQRCode
          restaurantId={qrCodeRestaurant.id}
          restaurantName={qrCodeRestaurant.name}
          open={!!qrCodeRestaurant}
          onOpenChange={(open) => {
            if (!open) setQrCodeRestaurant(null)
          }}
        />
      )}
    </div>
  )
}
