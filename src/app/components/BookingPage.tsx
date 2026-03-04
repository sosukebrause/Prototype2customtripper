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
  const [luggageCount, setLuggageCount] = useState<number>(2);

  useEffect(() => {
    const data = sessionStorage.getItem("tripData");
    const vehiclesData = sessionStorage.getItem("selectedVehicles");
    const destData = sessionStorage.getItem("additionalDestinations");
    const luggageData = sessionStorage.getItem("luggageCount");

    if (data && vehiclesData) {
      setTripData(JSON.parse(data));
      setSelectedVehicles(JSON.parse(vehiclesData));
      if (destData) {
        setAdditionalDestinations(JSON.parse(destData));
      }
      if (luggageData) {
        setLuggageCount(parseInt(luggageData));
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

    // Save booking data to sessionStorage for confirmation page
    sessionStorage.setItem("bookingReference", bookingRef);
    sessionStorage.setItem("specialRequests", specialRequests);

    // Build the trip record for the Dashboard
    const vehicleCount = Object.values(selectedVehicles).reduce(
      (sum, qty) => sum + qty,
      0
    );
    const totalPrice = calculateTotalPrice();

    const newTrip = {
      id: `trip-${Date.now()}`,
      bookingReference: bookingRef,
      tripName: tripData!.tripName,
      startLocation: tripData!.startLocation,
      destination: tripData!.destination,
      dateRange: tripData!.dateRange,
      isFlexibleDates: tripData!.isFlexibleDates,
      selectedMonth: tripData!.selectedMonth,
      numberOfDays: tripData!.numberOfDays,
      passengers: tripData!.passengers,
      vehicleCount,
      status: "in-progress",
      createdAt: new Date().toISOString(),
      totalPrice,
    };

    // Persist to localStorage so the Dashboard can display it
    const existing = localStorage.getItem("savedTrips");
    const savedTrips = existing ? JSON.parse(existing) : [];
    savedTrips.unshift(newTrip);
    localStorage.setItem("savedTrips", JSON.stringify(savedTrips));

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

              <p className="text-sm text-gray-500 -mt-2 mb-4">{tripData.tripName}</p>

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

                {/* Date / Passengers / Luggage — 3-column row */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  {/* Column 1 — Date */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="size-4" />
                      <span className="text-sm font-medium text-gray-700">Date</span>
                    </div>
                    <div className="text-sm">
                      {tripData.isFlexibleDates
                        ? `${tripData.selectedMonth} (${tripData.numberOfDays})`
                        : tripData.dateRange.from && tripData.dateRange.to
                          ? `${format(new Date(tripData.dateRange.from), "MMM dd, yyyy")} – ${format(new Date(tripData.dateRange.to), "MMM dd, yyyy")}`
                          : "Dates not specified"}
                    </div>
                  </div>

                  {/* Column 2 — Passengers */}
                  <div className="flex flex-col gap-1 border-l pl-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="size-4" />
                      <span className="text-sm font-medium text-gray-700">Passengers</span>
                    </div>
                    <div className="text-sm">
                      {tripData.passengers} Passenger{tripData.passengers !== "1" ? "s" : ""}
                    </div>
                  </div>

                  {/* Column 3 — Luggage */}
                  <div className="flex flex-col gap-1 border-l pl-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="size-4" />
                      <span className="text-sm font-medium text-gray-700">Luggage</span>
                    </div>
                    <div className="text-sm">
                      {luggageCount} Bag{luggageCount !== 1 ? "s" : ""}
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
              <div className="text-sm text-gray-700 overflow-y-auto max-h-48 border border-gray-200 rounded-md p-4 space-y-3 mb-4 bg-gray-50">
                <p className="text-gray-600 leading-relaxed">
                  By entering your payment details and confirming your booking, you agree to the following Payment Authorization &amp; Collection Terms:
                </p>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">1. Deposit at Booking</p>
                  <p className="text-gray-600 leading-relaxed">At the time of booking, you authorize Zengo to charge your selected payment method for a non-refundable deposit equal to 30% of the estimated total trip cost. This deposit secures your reservation and will be applied toward your final balance.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">2. Estimated Pricing</p>
                  <p className="text-gray-600 leading-relaxed mb-1">The total price presented at checkout is an estimate based on the planned itinerary and services requested at the time of booking. Your final total may vary based on:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>Actual duration of services</li>
                    <li>Additional time or distance</li>
                    <li>Extra stops or itinerary changes</li>
                    <li>Additional services requested</li>
                    <li>Applicable taxes, fees, tolls, or surcharges</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-1">You agree to pay the final amount based on actual services provided.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">3. Authorization to Store Payment Method</p>
                  <p className="text-gray-600 leading-relaxed mb-1">By submitting your payment details, you authorize Zengo to:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>Securely store your payment method with our payment processor</li>
                    <li>Retain it on file for the purpose of charging the remaining balance</li>
                    <li>Use it for authorized future charges related to this booking</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-1">Your payment information is stored securely by our payment processor and is not stored directly on our servers.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">4. Pre-Trip Authorization</p>
                  <p className="text-gray-600 leading-relaxed mb-1">Because trips may be booked up to six (6) months in advance, you authorize us to perform a pre-authorization on your payment method approximately three (3) days before your scheduled trip date. This pre-authorization:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>Is not an additional charge</li>
                    <li>May temporarily reduce your available credit</li>
                    <li>May appear as a pending transaction on your statement</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-1">If the pre-authorization fails, we may contact you to provide an updated payment method. Failure to provide valid payment details may result in cancellation of your booking.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">5. Final Balance Charge (Post-Trip)</p>
                  <p className="text-gray-600 leading-relaxed mb-1">You authorize Zengo to charge your saved payment method for the remaining balance one (1) day after completion of services. You acknowledge and agree that:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>You will not be required to re-enter your card details</li>
                    <li>The charge may be processed without additional action from you</li>
                    <li>The final amount will reflect actual services rendered</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">6. Failed or Declined Payments</p>
                  <p className="text-gray-600 leading-relaxed mb-1">If the final balance charge is declined:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>We may retry the payment</li>
                    <li>We may contact you to obtain an alternative payment method</li>
                    <li>You remain responsible for any unpaid balance</li>
                    <li>Additional administrative fees may apply where permitted by law</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">7. Disputes</p>
                  <p className="text-gray-600 leading-relaxed">If you believe a charge was made in error, you agree to contact us directly at [support email/phone] before initiating a chargeback, so we may investigate and resolve the matter promptly.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">8. Acceptance of Terms</p>
                  <p className="text-gray-600 leading-relaxed mb-1">By clicking "Confirm Booking" and entering your payment details, you:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>Authorize the 30% deposit charge</li>
                    <li>Authorize storage of your payment method</li>
                    <li>Authorize pre-trip reauthorization</li>
                    <li>Authorize post-trip off-session charging of the remaining balance</li>
                    <li>Agree to pay the final amount based on actual services provided</li>
                  </ul>
                </div>
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
              <p className="text-xs text-gray-500 text-center mb-4">
                You may modify this booking at any time up until three days prior to departure. Navigate to the{" "}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="font-medium text-gray-700 hover:underline cursor-pointer"
                >
                  Trip Planner Dashboard
                </button>{" "}
                to do so.
              </p>

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