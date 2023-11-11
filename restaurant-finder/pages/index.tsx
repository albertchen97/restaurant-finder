import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/Map";

export default function Home() {
  // Load the Google Maps API script using useLoadScript() function from Google Maps API
  const { isLoaded } = useLoadScript({
    // Use the Google Maps API key stored locally
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  // Check if the Google Maps API script is loaded
  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}
