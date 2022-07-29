import { GoogleMap } from "@react-google-maps/api"; 

// Location type aliase, an object that contains the position property which
//  is a LatLngLiteral.
type Location = {
  setUserLocation: (position: google.maps.LatLngLiteral) => void;
};

export default function Locate({ setUserLocation }: Location) {
  const handleClick = () => {
        navigator.geolocation.getCurrentPosition(
        (geoPos: GeolocationPosition) => {
            setUserLocation({
              lat: geoPos.coords.latitude  + 10,
              lng: geoPos.coords.longitude + 10
            })
        },
          () => null,
        );
  }
  return (
    <div>
      <button
        className="locate"
        onClick={handleClick}>Locate</button>
    </div>

  )
}