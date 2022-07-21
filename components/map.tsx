import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";

// TypeScript aliases
type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;


// Render the map
export default function Map() {
  // React useMemo Hook (https://reactjs.org/docs/hooks-reference.html#usememo)
  // The useMemo Hook only runs when one of its dependencies update.
  // This can improve performace.

  // Use the React useMemo Hook to cache the map center location so that it does not need to be recalculated.
  const center = useMemo(() => ({ lat: 43, lng: -80 }), []);
  // Memoize the Google Maps options: disable the default UI elements and the clickable icons
  const options = useMemo(() => ({
    disableDefaultUI: true,
    clickableIcons: false,

  }), []);
  
  return (
    <div className="container">
      {/* Control panel on the left */}
      <div className="controls">
        <h1>Commute?</h1>
      </div>
      {/* Map on the right */}
      <div className="map">
        <GoogleMap
          mapContainerClassName="map-container"
          zoom={10}
          center={center}
          options={options}
          >
          
          </GoogleMap>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

// Generate random houses to display
const generateHouses = (position: LatLngLiteral) => {
  const _houses: Array<LatLngLiteral> = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _houses.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _houses;
};
