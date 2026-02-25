import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Calendar as CalendarIcon, User } from "lucide-react";
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
  const [numberOfDays, setNumberOfDays] = useState("2 days");
  const [passengers, setPassengers] = useState("1");

  const isFormValid = destination && (
    (!isFlexibleDates && dateRange.from && dateRange.to) ||
    (isFlexibleDates && selectedMonth && numberOfDays)
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
            placeholder="e.g., Summer vacation in Greece"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
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

        {/* Dates */}
        <div>
          <Label className="text-sm mb-2 block">Dates</Label>
          
          {!isFlexibleDates ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd")
                    )
                  ) : (
                    <span className="text-gray-400">Select dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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
              </PopoverContent>
            </Popover>
          ) : (
            <div className="space-y-4">
              {/* Month selector */}
              <div>
                <Label htmlFor="month" className="text-sm mb-2 block">
                  Month
                </Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="month" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jan">Jan</SelectItem>
                    <SelectItem value="Feb">Feb</SelectItem>
                    <SelectItem value="Mar">Mar</SelectItem>
                    <SelectItem value="Apr">Apr</SelectItem>
                    <SelectItem value="May">May</SelectItem>
                    <SelectItem value="Jun">Jun</SelectItem>
                    <SelectItem value="Jul">Jul</SelectItem>
                    <SelectItem value="Aug">Aug</SelectItem>
                    <SelectItem value="Sep">Sep</SelectItem>
                    <SelectItem value="Oct">Oct</SelectItem>
                    <SelectItem value="Nov">Nov</SelectItem>
                    <SelectItem value="Dec">Dec</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Number of days */}
              <div>
                <Label htmlFor="numberOfDays" className="text-sm mb-2 block">
                  Number of days
                </Label>
                <Select value={numberOfDays} onValueChange={setNumberOfDays}>
                  <SelectTrigger id="numberOfDays" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 day">1 day</SelectItem>
                    <SelectItem value="2 days">2 days</SelectItem>
                    <SelectItem value="3 days">3 days</SelectItem>
                    <SelectItem value="4 days">4 days</SelectItem>
                    <SelectItem value="5 days">5 days</SelectItem>
                    <SelectItem value="6 days">6 days</SelectItem>
                    <SelectItem value="7 days">7 days</SelectItem>
                    <SelectItem value="14 days">14 days</SelectItem>
                    <SelectItem value="21 days">21 days</SelectItem>
                    <SelectItem value="30 days">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Flexible dates checkbox */}
          <div className="flex items-center space-x-2 mt-3">
            <Checkbox
              id="flexibleDates"
              checked={isFlexibleDates}
              onCheckedChange={(checked) => setIsFlexibleDates(checked === true)}
            />
            <label
              htmlFor="flexibleDates"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Flexible dates
            </label>
          </div>
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