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

// TypeScript type aliases
type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;


// Render the map
export default function Map() {

  // React userRef Hook (https://reactjs.org/docs/hooks-reference.html#useref)
  //    useRef returns a mutable ref object whose
  //    ".current" property is initialized to the passed argument(initialValue).
  //    The returned object will persist for the full lifetime of the component.
  
  // mapRef: a React ref object (https://reactjs.org/docs/refs-and-the-dom.html)
  //         for the map ID.
  const mapRef = useRef<GoogleMap>();

  // React useMemo Hook (https://reactjs.org/docs/hooks-reference.html#usememo)
  //    Returns a memoized value.
  //    Pass a “create” function and an array of dependencies. 
  //    useMemo will only recompute the memoized value when one of the dependencies has changed.
  //    This optimization helps to avoid expensive calculations on every render.

  // center: the React useMemo Hook for the initial center location
  const center = useMemo<LatLngLiteral>(() => ({ lat: 43, lng: -80 }), []);
  
  // options: memoize the Google Maps options
  const options = useMemo<MapOptions>(() => ({    
    // mapId: the styled map ID
    mapId: "1691f2058063216f",
    disableDefaultUI: true,
    clickableIcons: false,
  }), []);

  // React useCallback Hook (https://reactjs.org/docs/hooks-reference.html#usecallback)
  //    Returns a memoized callback.
  //    Pass an inline callback and an array of dependencies.
  //    useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed.
  //    This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders
  //    useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).

  // State for the office
  const [office, setOffice] = useState<LatLngLiteral>();

  // onLoad: a callback for the mapRef object; initialize the ".current" property.
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  
  // houses: memo for the houses
  const houses = useMemo(() => generateHouses(center), [center]);

  return (
    <div className="container">
      {/* Control panel on the left */}
      <div className="controls">
        <h1>Commute?</h1>
        <Places setOffice={(position) => {
          setOffice(position);
          mapRef.current?.panTo(position);
        } } />
      </div>
      {/* Map on the right */}
      <div className="map">
        <GoogleMap
          mapContainerClassName="map-container"
          zoom={10}
          center={center}
          options={options}
          onLoad={onLoad}
          >
          
          {/* Show the office marker on the map*/}
          {office && (
            <>
              <Marker position={office}
                  icon = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"  
              />

              {/* Cluster the houses (group houses and show number of houses on the same area) */}
              <MarkerClusterer>
                {(clusterer) =>
                  houses.map((house) => (
                    <Marker
                      key={house.lat}
                      position={house}
                      clusterer={clusterer} />
                  ))
                }
              </MarkerClusterer>

              {houses.map((house) => (
                <Marker key={house.lat} position={house} />
              ))}

              {/* Add circles for the commutable circle areas (radius in meters)*/}
              <Circle center={office} radius={15000} options={ closeOptions } />
              <Circle center={office} radius={30000} options={ middleOptions } />
              <Circle center={office} radius={45000} options={ farOptions } />
            </>
          )


          }
          


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
