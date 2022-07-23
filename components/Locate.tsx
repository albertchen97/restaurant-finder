import { GoogleMap } from "@react-google-maps/api"; 

// Location type aliase, an object that contains the position property which
//  is a LatLngLiteral.
type Location = {
  setLocation: (position: google.maps.LatLngLiteral) => void;
};
export default function Locate({ setLocation }: Location) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
        (geoPos: GeolocationPosition) => {
            setLocation({
              lat: geoPos.coords.latitude,
              lng: geoPos.coords.longitude
            })
        },
          () => null,
        );
      }}>Locate</button>
  )
}