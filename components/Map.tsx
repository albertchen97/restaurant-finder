import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Search from "./Search";
import Distance from "./Distance";
import Notification from './Notification'
import Locate from '../components/Locate'

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

  // center: the React useMemo Hook for the initial center userLocation
  // const center = useMemo<LatLngLiteral>(() => ({ lat: 43.45, lng: -80.49 }), []);
  
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

  // Initial location
  const initialLocation = useMemo<LatLngLiteral>(() => ({ lat: 50, lng: -90 }), []);
  
  // User location
  const [userLocation, setUserLocation] = useState<LatLngLiteral>(initialLocation);

  // State for directions
  const [directions, setDirections] = useState<DirectionsResult>();

  // onLoad: a callback for the mapRef object; initialize the ".current" property.
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  // // restaurants: memo for the restaurants generated around the center
  const restaurants = useMemo(() => generateRestaurants(userLocation), []);

  // // userLocation: store the user location from either "userLocation" or "userLocation"
  // const userLocation = useMemo(() => userLocation || userLocation, [center]);

  // fetchDirections: get the direction from the restaurant the user clicked on to the userLocation
  const fetchDirections = (restaurant: LatLngLiteral) => {
    // Return nothing if there is no user location
    // if (!(userLocation && userLocation)) return;
    // if (!userLocation) return;
    if (!userLocation) return;
    
    const service = new google.maps.DirectionsService();
    
    // Issue a direction search request from the user's location to the restaurant via driving
    //  and place the result into a state
    service.route({
      origin: userLocation,
      // origin: center,
      destination: restaurant,
      travelMode: google.maps.TravelMode.DRIVING
    },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  return (
    <div className="container">

      {/* Control panel on the left */}
      <div className="controls">
        <h1>Search restaurants around you</h1>

        {/* The search bar, which allows user to enter their location manually */}
        <Search setUserLocation={(position) => {
          setUserLocation(position);
          mapRef.current?.panTo(position);
        }} />
        
        {/* If there is no userLocation, let the user enter the userLocation address */}
        {!userLocation && <p>Enter the address of your userLocation or click "Locate" to locate you!</p>}

        <br /><br />
        <div>
          {/* The "Locate" button, which will move the map center to the user's current userLocation. */}
          <Locate setUserLocation={(position) => {
            setUserLocation(position);
            mapRef.current?.panTo(position);
          }} />
        </div>

        {/* Prompt the notification after location found */}
        {mapRef.current && <Notification />}

        {/* Calculate the distance from home to userLocation */}
        {/* Leg: a section or portion of a journey or course */}
        {/* Get the distance of the first leg of the first route */}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      
      </div>
      
      {/* Map on the right */}
      <div className="map">
        <GoogleMap
          mapContainerClassName="map-container"
          zoom={10}
          center={userLocation}
          options={options}
          onLoad={onLoad}
        >
          {/* Render the direction route line on the map */}
          {directions && <DirectionsRenderer directions={directions} options={{
            polylineOptions: {
              zIndex: 50,
              strokeColor: "#1976D2",
              strokeWeight: 5
            }
          }} />}
          
          {/* Show the userLocation marker on the map*/}
          {userLocation&& (
            <>
              <Marker position={userLocation}
                  icon = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"  
              />

              {/* Cluster the restaurants (group restaurants and show number of restaurants on the same area) */}
              <MarkerClusterer>
                {(clusterer) =>
                  restaurants.map((restaurant) => (
                    <Marker
                      key={restaurant.lat}
                      position={restaurant}
                      clusterer={clusterer}
                      // When clicking a restaurant, display the direction from the restaurant to the userLocation
                        onClick={() => {
                          fetchDirections(restaurant)
                        }
                      }
                    />
                  ))
                }
              </MarkerClusterer>

              {/* {restaurants.map((restaurant) => (
                <Marker key={restaurant.lat} position={restaurant} />
              ))} */}

              {/* Add circles for the commutable circle areas (radius in meters)*/}
              {/* The circle center is the user's location */}
              <Circle center={userLocation} radius={15000} options={ closeOptions } />
              <Circle center={userLocation} radius={30000} options={ middleOptions } />
              <Circle center={userLocation} radius={45000} options={ farOptions } />
            </>
          )
          }
        </GoogleMap>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.9,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.5,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.5,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.15,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

// Generate random restaurants to display
const generateRestaurants = (position: LatLngLiteral) => {
  const _restaurants: Array<LatLngLiteral> = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _restaurants.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _restaurants;
};
