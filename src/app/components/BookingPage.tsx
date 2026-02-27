import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  MapPin,
  User,
  Briefcase,
  Calendar,
  DollarSign,
  Phone,
  Mail,
} from "lucide-react";
import { format } from "date-fns";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Header } from "./Header";

type TripData = {
  tripName: string;
  startLocation: string;
  destination: string;
  dateRange: {
    from: string | undefined;
    to: string | undefined;
  };
  isFlexibleDates: boolean;
  selectedMonth: string;
  numberOfDays: string;
  passengers: string;
};

type VehicleOption = {
  id: string;
  name: string;
  hourlyRate: number;
  fullDayRate: number;
  passengerCapacity: number;
  luggageCapacity: number;
  imageUrl: string;
};

const vehicles: VehicleOption[] = [
  {
    id: "comfort-van",
    name: "Comfort Van",
    hourlyRate: 95,
    fullDayRate: 420,
    passengerCapacity: 7,
    luggageCapacity: 4,
    imageUrl: "https://images.unsplash.com/photo-1692279952778-00ce5c3ce02c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb21mb3J0JTIwdmFufGVufDF8fHx8MTc3MTkxNDQ3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "premium-van",
    name: "Premium Van",
    hourlyRate: 110,
    fullDayRate: 580,
    passengerCapacity: 7,
    luggageCapacity: 5,
    imageUrl: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwdmFufGVufDF8fHx8MTc3MTkxNDUwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "luxury-sedan",
    name: "Luxury Sedan",
    hourlyRate: 125,
    fullDayRate: 650,
    passengerCapacity: 4,
    luggageCapacity: 3,
    imageUrl: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzZWRhbnxlbnwxfHx8fDE3NzE5MTQ1MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "crossover-suv",
    name: "Crossover SUV",
    hourlyRate: 85,
    fullDayRate: 450,
    passengerCapacity: 5,
    luggageCapacity: 3,
    imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9zc292ZXIlMjBzdXZ8ZW58MXx8fHwxNzcxOTE0NTEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export function BookingPage() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState<TripData | null>(
    null,
  );
  const [selectedVehicles, setSelectedVehicles] = useState<
    Record<string, number>
  >({});
  const [additionalDestinations, setAdditionalDestinations] =
    useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [estimatedHours] = useState(8); // Default to full day

  useEffect(() => {
    const data = sessionStorage.getItem("tripData");
    const vehiclesData = sessionStorage.getItem(
      "selectedVehicles",
    );
    const destData = sessionStorage.getItem(
      "additionalDestinations",
    );

    if (data && vehiclesData) {
      setTripData(JSON.parse(data));
      setSelectedVehicles(JSON.parse(vehiclesData));
      if (destData) {
        setAdditionalDestinations(JSON.parse(destData));
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!tripData) {
    return null;
  }

  const calculateTotalPrice = () => {
    let total = 0;
    Object.entries(selectedVehicles).forEach(
      ([vehicleId, quantity]) => {
        const vehicle = vehicles.find(
          (v) => v.id === vehicleId,
        );
        if (vehicle) {
          // Use full day rate if 5+ hours
          const rate =
            estimatedHours >= 5
              ? vehicle.fullDayRate
              : vehicle.hourlyRate * estimatedHours;
          total += rate * quantity;
        }
      },
    );
    return total;
  };

  const handleConfirmBooking = () => {
    // Generate booking reference
    const bookingRef = `BK${Date.now().toString().slice(-8)}`;

    // Save booking data
    sessionStorage.setItem("bookingReference", bookingRef);
    sessionStorage.setItem("specialRequests", specialRequests);

    navigate("/confirmation");
  };

  const allLocations = [
    tripData.startLocation,
    tripData.destination,
    ...additionalDestinations,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/select-vehicle")}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
        >
          ← Back to Vehicle Selection
        </button>

        <h1 className="text-2xl font-bold mb-8">
          Booking Summary
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Trip Details
              </h2>

              <div className="space-y-4">
                {/* Route */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Route
                  </div>
                  <div className="space-y-2">
                    {allLocations.map((location, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`size-3 rounded-full ${
                              index === 0
                                ? "bg-green-500"
                                : index ===
                                    allLocations.length - 1
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                            }`}
                          />
                          {index < allLocations.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-300 my-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {location}
                          </p>
                          {index === 0 && (
                            <span className="text-xs text-gray-500">
                              Starting point
                            </span>
                          )}
                          {index ===
                            allLocations.length - 1 && (
                            <span className="text-xs text-gray-500">
                              Final destination
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Calendar className="size-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Date
                    </div>
                    <div className="text-sm">
                      {tripData.isFlexibleDates
                        ? `${tripData.selectedMonth} (${tripData.numberOfDays})`
                        : tripData.dateRange.from &&
                            tripData.dateRange.to
                          ? `${format(new Date(tripData.dateRange.from), "MMM dd, yyyy")} - ${format(new Date(tripData.dateRange.to), "MMM dd, yyyy")}`
                          : "Dates not specified"}
                    </div>
                  </div>
                </div>

                {/* Passengers */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <User className="size-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      Passengers
                    </div>
                    <div className="text-sm">
                      {tripData.passengers} Passenger
                      {tripData.passengers !== "1" ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Map Visualization */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Route Map
              </h2>
              <div className="relative bg-gray-100 rounded-lg h-80 flex items-center justify-center overflow-hidden">
                {/* Simple Static Map Representation */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 300"
                  className="absolute inset-0"
                >
                  {/* Background grid */}
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill="url(#grid)"
                  />

                  {/* Route path */}
                  {allLocations.length === 2 && (
                    <path
                      d="M 100 80 Q 200 100 300 220"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                  )}
                  {allLocations.length === 3 && (
                    <path
                      d="M 80 100 Q 150 150 200 180 Q 250 200 320 240"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                  )}
                  {allLocations.length > 3 && (
                    <path
                      d="M 60 80 Q 120 120 180 150 Q 240 180 280 200 Q 320 220 340 250"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                  )}

                  {/* Location markers */}
                  {allLocations.map((_, index) => {
                    const positions =
                      allLocations.length === 2
                        ? [
                            { x: 100, y: 80 },
                            { x: 300, y: 220 },
                          ]
                        : allLocations.length === 3
                          ? [
                              { x: 80, y: 100 },
                              { x: 200, y: 180 },
                              { x: 320, y: 240 },
                            ]
                          : [
                              { x: 60, y: 80 },
                              { x: 180, y: 150 },
                              { x: 280, y: 200 },
                              { x: 340, y: 250 },
                            ];

                    const pos =
                      positions[
                        Math.min(index, positions.length - 1)
                      ];
                    const isStart = index === 0;
                    const isEnd =
                      index === allLocations.length - 1;
                    const color = isStart
                      ? "#10b981"
                      : isEnd
                        ? "#ef4444"
                        : "#3b82f6";

                    return (
                      <g key={index}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="12"
                          fill={color}
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 4}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {String.fromCharCode(65 + index)}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-1">
                  {allLocations.map((location, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={`size-3 rounded-full ${
                          index === 0
                            ? "bg-green-500"
                            : index === allLocations.length - 1
                              ? "bg-red-500"
                              : "bg-blue-500"
                        }`}
                      />
                      <span className="font-medium">
                        {String.fromCharCode(65 + index)}:
                      </span>
                      <span className="truncate max-w-[200px]">
                        {location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Selected Vehicles */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Selected Vehicles
              </h2>
              <div className="space-y-3">
                {Object.entries(selectedVehicles).map(
                  ([vehicleId, quantity]) => {
                    const vehicle = vehicles.find(
                      (v) => v.id === vehicleId,
                    );
                    if (!vehicle) return null;

                    const rate =
                      estimatedHours >= 5
                        ? vehicle.fullDayRate
                        : vehicle.hourlyRate * estimatedHours;
                    const subtotal = rate * quantity;

                    return (
                      <div
                        key={vehicleId}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={vehicle.imageUrl}
                          alt={vehicle.name}
                          className="w-24 h-16 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="font-medium">
                            {vehicle.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            Quantity: {quantity} × $
                            {rate.toFixed(2)}
                          </div>
                        </div>
                        <div className="font-semibold">
                          ${subtotal.toFixed(2)}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </Card>

            {/* Special Requests */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Notes or Comments
              </h2>
              <textarea
                value={specialRequests}
                onChange={(e) =>
                  setSpecialRequests(e.target.value)
                }
                placeholder="Enter any special requests, accessibility needs, or additional information..."
                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                After booking, you will have the chance to
                provide any additional detail related to your
                specific trip.{" "}
              </p>
            </Card>

            {/* Terms and Conditions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Terms & Conditions
              </h2>
              <div className="text-sm text-gray-700 space-y-2 mb-4">
                <p>
                  By proceeding with this booking, you
                  acknowledge and agree to the following:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    All bookings are subject to vehicle
                    availability
                  </li>
                  <li>
                    Cancellations must be made 24 hours in
                    advance for a full refund
                  </li>
                  <li>
                    Additional charges may apply for route
                    changes or extended hours
                  </li>
                  <li>
                    Payment information must be provided before
                    final confirmation
                  </li>
                  <li>
                    Prices are subject to change until booking
                    is finalized
                  </li>
                </ul>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setAgreeToTerms(checked as boolean)
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm cursor-pointer"
                >
                  I have read and agree to the Terms &
                  Conditions
                </label>
              </div>
            </Card>
          </div>

          {/* Right Column - Pricing Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">
                Price Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal
                  </span>
                  <span className="font-medium">
                    ${calculateTotalPrice().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Service Fee
                  </span>
                  <span className="font-medium">
                    ${(calculateTotalPrice() * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Tax (10%)
                  </span>
                  <span className="font-medium">
                    ${(calculateTotalPrice() * 0.1).toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">
                      Total
                    </span>
                    <span className="font-bold text-2xl text-blue-600">
                      $
                      {(calculateTotalPrice() * 1.2).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                * Final pricing will be confirmed after all
                mandatory details are provided
              </p>

              <Button
                size="lg"
                className="w-full mb-4"
                disabled={!agreeToTerms}
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </Button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <Phone className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-blue-900">
                      Questions or Comments?
                    </div>
                    <div className="text-xs text-blue-700 mt-1">
                      Contact our Sales Representative
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Mail className="size-4 text-blue-600" />
                  <a
                    href="mailto:sales@tripplanner.com"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    sales@tripplanner.com
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}