import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Calendar as CalendarIcon, User, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export function CreateTripForm() {
  const navigate = useNavigate();
  const [tripName, setTripName] = useState("");
  const [startLocation, setStartLocation] = useState("Tokyo Station Hotel");
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [isFlexibleDates, setIsFlexibleDates] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Feb");
  const [numberOfDays, setNumberOfDays] = useState("1 day");
  const [passengers, setPassengers] = useState("1");
  
  // New state for the enhanced date picker
  const [whenTab, setWhenTab] = useState<"specific" | "flexible" | "anytime">("specific");
  const [tourDuration, setTourDuration] = useState<string>("any");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [isWhenPopoverOpen, setIsWhenPopoverOpen] = useState(false);
  const [isAnytimeSelected, setIsAnytimeSelected] = useState(false);

  const isFormValid = destination && (
    isAnytimeSelected || 
    selectedMonths.length > 0 || 
    (dateRange.from && dateRange.to)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const finalTripName = tripName.trim() || "Trip 1";
      const tripData = {
        tripName: finalTripName,
        startLocation,
        destination,
        dateRange,
        isFlexibleDates,
        selectedMonth,
        numberOfDays,
        passengers,
        // New fields for enhanced date picker
        whenTab,
        tourDuration,
        selectedYear,
        selectedMonths,
        isAnytimeSelected,
      };
      // Store in sessionStorage to pass to next page
      sessionStorage.setItem("tripData", JSON.stringify(tripData));
      // Navigate to next step
      navigate("/select-vehicle");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="mb-6">Create a trip</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip name */}
        <div>
          <Label htmlFor="tripName" className="text-sm mb-2 block">
            Trip name
          </Label>
          <Input
            id="tripName"
            type="text"
            placeholder="Trip 1"
            value={tripName}
            onChange={(e) => {
              setTripName(e.target.value);
              // Keep any cached tripRecords in sync so VehicleSelection
              // always shows the latest name, even when returning from that page.
              const raw = sessionStorage.getItem("tripRecords");
              if (raw) {
                const records = JSON.parse(raw);
                if (records["trip-1"]) {
                  records["trip-1"].tripData.tripName =
                    e.target.value.trim() || "Trip 1";
                  sessionStorage.setItem("tripRecords", JSON.stringify(records));
                }
              }
            }}
            maxLength={80}
            className="w-full"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {tripName.length}/80 max characters
          </div>
        </div>

        {/* Start location */}
        <div>
          <Label htmlFor="startLocation" className="text-sm mb-2 block">
            Start location
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              id="startLocation"
              type="text"
              placeholder="Where from?"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Destination */}
        <div>
          <Label htmlFor="destination" className="text-sm mb-2 block">
            Destination
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 z-10 pointer-events-none" />
            <GooglePlacesAutocomplete
              id="destination"
              placeholder="Where to?"
              value={destination}
              onChange={setDestination}
              className="w-full pl-10"
              required
            />
          </div>
        </div>

        {/* Dates - New "When?" Interface */}
        <div>
          <Label className="text-sm mb-2 block">When?</Label>
          
          <Popover open={isWhenPopoverOpen} onOpenChange={setIsWhenPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 size-4" />
                {isAnytimeSelected ? (
                  <span>Anytime</span>
                ) : whenTab === "specific" && dateRange.from && dateRange.to ? (
                  <span>{format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}</span>
                ) : whenTab === "flexible" && selectedMonths.length > 0 ? (
                  <span>{selectedMonths.join(", ")} {selectedYear}</span>
                ) : (
                  <span className="text-gray-400">Select dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 scale-[0.8] origin-top-left" align="start" side="bottom" sideOffset={8} avoidCollisions={false}>
              {/* Tab Headers - Custom styling to match image */}
              <div className="flex border-b">
                <button
                  type="button"
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    whenTab === "specific"
                      ? "border-b-2 border-black text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                  onClick={() => {
                    setWhenTab("specific");
                    setIsAnytimeSelected(false);
                  }}
                >
                  Specific dates
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    whenTab === "flexible"
                      ? "border-b-2 border-black text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                  onClick={() => {
                    setWhenTab("flexible");
                    setIsAnytimeSelected(false);
                  }}
                >
                  Flexible dates
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    whenTab === "anytime"
                      ? "border-b-2 border-black text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                  onClick={() => {
                    setWhenTab("anytime");
                    setIsAnytimeSelected(true);
                    setIsWhenPopoverOpen(false);
                  }}
                >
                  Anytime
                </button>
              </div>

              <div className="p-6">
                {/* Specific dates content */}
                {whenTab === "specific" && (
                  <div className="space-y-4">

                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => {
                        if (range) {
                          setDateRange({ from: range.from, to: range.to });
                        }
                      }}
                      numberOfMonths={2}
                      initialFocus
                    />
                    {/* Footer buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setDateRange({ from: undefined, to: undefined });
                          setIsWhenPopoverOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={() => {
                          setIsWhenPopoverOpen(false);
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}

                {/* Flexible dates content */}
                {whenTab === "flexible" && (
                  <div className="space-y-6">
                    {/* How long? */}
                    <div>
                      <Label className="text-sm mb-3 block font-medium text-center">How long?</Label>
                      <div className="grid grid-cols-4 gap-2">
                        <Button
                          type="button"
                          variant={tourDuration === "any" ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-auto py-3"
                          onClick={() => setTourDuration("any")}
                        >
                          <div className="font-medium">Undecided</div>
                          <div className="text-xs text-muted-foreground mt-1">I'll decide later</div>
                        </Button>
                        <Button
                          type="button"
                          variant={tourDuration === "short" ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-auto py-3"
                          onClick={() => setTourDuration("short")}
                        >
                          <div className="font-medium">Short stay</div>
                          <div className="text-xs text-muted-foreground mt-1">1 to 3 nights</div>
                        </Button>
                        <Button
                          type="button"
                          variant={tourDuration === "medium" ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-auto py-3"
                          onClick={() => setTourDuration("medium")}
                        >
                          <div className="font-medium">Medium stay</div>
                          <div className="text-xs text-muted-foreground mt-1">4 to 7 nights</div>
                        </Button>
                      </div>
                    </div>

                    {/* When? */}
                    <div>
                      <Label className="text-sm mb-3 block font-medium text-center">When?</Label>

                      {/* Month grid with year labels */}
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          { month: "March", shortMonth: "Mar", year: "2026" },
                          { month: "April", shortMonth: "Apr", year: "2026" },
                          { month: "May", shortMonth: "May", year: "2026" },
                          { month: "June", shortMonth: "Jun", year: "2026" },
                          { month: "July", shortMonth: "Jul", year: "2026" },
                          { month: "August", shortMonth: "Aug", year: "2026" },
                          { month: "September", shortMonth: "Sep", year: "2026" },
                          { month: "October", shortMonth: "Oct", year: "2026" },
                          { month: "November", shortMonth: "Nov", year: "2026" },
                          { month: "December", shortMonth: "Dec", year: "2026" },
                          { month: "January", shortMonth: "Jan", year: "2027" },
                          { month: "February", shortMonth: "Feb", year: "2027" },
                        ].map(({ month, shortMonth, year }) => (
                          <Button
                            key={`${shortMonth}-${year}`}
                            type="button"
                            variant={selectedMonths.includes(`${shortMonth} ${year}`) ? "default" : "outline"}
                            className="flex flex-col items-center justify-center h-auto py-3 relative"
                            onClick={() => {
                              const monthYear = `${shortMonth} ${year}`;
                              if (selectedMonths.includes(monthYear)) {
                                setSelectedMonths(selectedMonths.filter(m => m !== monthYear));
                              } else {
                                setSelectedMonths([...selectedMonths, monthYear]);
                              }
                            }}
                          >
                            <div className="font-medium">{month}</div>
                            <div className="text-xs text-muted-foreground mt-1">{year}</div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSelectedMonths([]);
                          setTourDuration("any");
                          setIsWhenPopoverOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={() => {
                          setIsWhenPopoverOpen(false);
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Number of passengers */}
        <div>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger className="w-fit px-3">
              <User className="size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Passenger</SelectItem>
              <SelectItem value="2">2 Passengers</SelectItem>
              <SelectItem value="3">3 Passengers</SelectItem>
              <SelectItem value="4">4 Passengers</SelectItem>
              <SelectItem value="5">5 Passengers</SelectItem>
              <SelectItem value="6">6 Passengers</SelectItem>
              <SelectItem value="7">7 Passengers</SelectItem>
              <SelectItem value="8">8 Passengers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full"
          disabled={!isFormValid}
        >
          Continue
        </Button>
      </form>
    </div>
  );
}