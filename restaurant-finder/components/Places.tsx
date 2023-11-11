// Search.tsx - The Places component which allows the user to search places on Google Maps
//  in the search bar.

// Places Autocomplete - Automatically complete the place user searches in the search bar
//  (e.g., type "ne" gives "New York")

// usePlacesAutocomplete - A React hook for Google Maps Places Autocomplete,
// which helps you build a UI component with the feature of place autocomplete easily!
// (https://www.npmjs.com/package/use-places-autocomplete)
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

// Combobox - Also called an autocomplete or autosuggest component.
// A "combobox" is a plain text input that can provide a list of suggestions.
// The <Combobox> allows any text value but also provides a list of auto complete
// options to select from.
// (https://www.npmjs.com/package/@reach/combobox)
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import Notification from "./Notification";
import { useEffect } from "react";

type PlacesProps = {
  setUserLocation: (position: google.maps.LatLngLiteral) => void;
};

export default function Places({ setUserLocation }: PlacesProps) {
  const {
    ready,
    value,
    setValue,
    // Autocomplete suggestions
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  // handleSelect - Handle the onSelect event for the Combobox
  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();

    const results = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(results[0]);
    setUserLocation({ lat, lng });
  };

  return (
    <div>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="combobox-input"
          placeholder="Enter your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
