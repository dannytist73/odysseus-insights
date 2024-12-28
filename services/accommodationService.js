// services/accommodationService.js
export async function getAccommodations(
  destination,
  startDate,
  endDate,
  travelers = 2
) {
  try {
    // TODO: Integrate with real accommodation API
    // This is mock data for development
    return [
      {
        id: 1,
        name: "Grand Hotel Plaza",
        price: 199,
        image: "/api/placeholder/400/300",
        rating: 4.5,
        reviews: 128,
        link: "#",
        amenities: ["WiFi", "Pool", "Restaurant"],
      },
      {
        id: 2,
        name: "Family Resort & Spa",
        price: 299,
        image: "/api/placeholder/400/300",
        rating: 4.8,
        reviews: 256,
        link: "#",
        amenities: ["WiFi", "Pool", "Kids Club"],
      },
      {
        id: 3,
        name: "Coastal View Apartments",
        price: 150,
        image: "/api/placeholder/400/300",
        rating: 4.3,
        reviews: 89,
        link: "#",
        amenities: ["Kitchen", "Beach Access", "WiFi"],
      },
    ];
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    throw new Error("Failed to fetch accommodation data");
  }
}
