import { forwardRef } from "react";
import Autocomplete from "react-google-autocomplete";
import { cn } from "./ui/utils";

// IMPORTANT: Replace this with your actual Google Maps API key
// Get your API key from: https://console.cloud.google.com/google/maps-apis
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
}

export const GooglePlacesAutocomplete = forwardRef<
  HTMLInputElement,
  GooglePlacesAutocompleteProps
>(
  (
    {
      value,
      onChange,
      onPlaceSelected,
      placeholder = "Search for a location...",
      className,
      id,
      required = false,
    },
    ref
  ) => {
    // Fallback to regular input if no API key is configured
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
      return (
        <div>
          <input
            ref={ref}
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            required={required}
          />
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ Google Maps API key not configured. Using fallback input.
          </p>
        </div>
      );
    }

    return (
      <Autocomplete
        ref={ref}
        apiKey={GOOGLE_MAPS_API_KEY}
        onPlaceSelected={(place) => {
          if (place.formatted_address) {
            onChange(place.formatted_address);
          }
          if (onPlaceSelected) {
            onPlaceSelected(place);
          }
        }}
        onChange={(e) => onChange(e.target.value)}
        options={{
          types: ["geocode", "establishment"],
        }}
        placeholder={placeholder}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        defaultValue={value}
      />
    );
  }
);

GooglePlacesAutocomplete.displayName = "GooglePlacesAutocomplete";
