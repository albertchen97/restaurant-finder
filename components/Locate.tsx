import { GoogleMap } from "@react-google-maps/api"; 
type LocationProps = {
  setLocation: (location: google.maps.LatLngLiteral) => void;
};
export default function Locate({ setLocation }: LocationProps) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (location) => {
            // lat: location.coords.latitude;
            // lng: location.coords.longitude;
            console.log(location)
          }
          ,
          () => null,
        );
      }}>Locate</button>
  )
}