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

    // Read all multi-part trip records saved by VehicleSelection
    const rawRecords = sessionStorage.getItem("tripRecords");
    const tripRecords: Record<string, {
      tripData: TripData;
      additionalDestinations: string[];
      selectedVehicles: Record<string, number>;
    }> = rawRecords ? JSON.parse(rawRecords) : {};

    const tabEntries = Object.entries(tripRecords).sort(([a], [b]) =>
      a.localeCompare(b, undefined, { numeric: true })
    );

    // Build tripTabs for the Dashboard so it can show all parts
    const tripTabs = tabEntries.length > 0
      ? tabEntries.map(([tabId, rec], i) => {
          const tabVehicleCount = Object.values(rec.selectedVehicles).reduce(
            (sum, qty) => sum + qty,
            0
          );
          const selectedVehicleNames = Object.entries(rec.selectedVehicles)
            .filter(([, qty]) => qty > 0)
            .map(([vehicleId, qty]) => {
              const v = vehicles.find(vv => vv.id === vehicleId);
              return v ? `${v.name}${qty > 1 ? ` ×${qty}` : ""}` : vehicleId;
            });
          return {
            tabId,
            tabLabel: `Part ${i + 1}`,
            startLocation: rec.tripData.startLocation,
            destination: rec.tripData.destination,
            additionalDestinations: rec.additionalDestinations,
            dateRange: rec.tripData.dateRange,
            isFlexibleDates: rec.tripData.isFlexibleDates,
            selectedMonth: rec.tripData.selectedMonth,
            numberOfDays: rec.tripData.numberOfDays,
            passengers: rec.tripData.passengers,
            vehicleCount: tabVehicleCount,
            selectedVehicleNames,
          };
        })
      : undefined;

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
      ...(tripTabs && tripTabs.length > 0 ? { tripTabs } : {}),
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
              {(() => {
                // Read all trip tab records saved by VehicleSelection
                const rawRecords = sessionStorage.getItem("tripRecords");
                const tripRecords: Record<string, {
                  tripData: TripData;
                  additionalDestinations: string[];
                  selectedVehicles: Record<string, number>;
                }> = rawRecords ? JSON.parse(rawRecords) : {};

                const tabEntries = Object.entries(tripRecords).sort(([a], [b]) =>
                  a.localeCompare(b, undefined, { numeric: true })
                );
                const isMultiTab = tabEntries.length > 1;

                const renderTripSection = (
                  tabId: string,
                  label: string,
                  td: TripData,
                  addDest: string[],
                  isLast: boolean
                ) => {
                  const locs = [td.startLocation, td.destination, ...addDest];
                  return (
                    <div key={tabId} className={!isLast ? "pb-6 border-b mb-6" : ""}>
                      {isMultiTab && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                            {label}
                          </span>
                          {/* Vehicle icon pill */}
                          {(() => {
                            const tabVehicles = tripRecords[tabId]?.selectedVehicles ?? {};
                            const entries = Object.entries(tabVehicles).filter(([, qty]) => (qty as number) > 0);
                            if (entries.length === 0) return null;
                            const vehicleEmoji = (id: string) =>
                              id.includes("van")  ? "🚐" :
                              id.includes("suv")  ? "🚙" :
                                                    "🚗";
                            return (
                              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
                                {entries.map(([vehicleId, qty]) => (
                                  <span key={vehicleId} className="flex items-center gap-0.5 text-sm leading-none">
                                    <span>{vehicleEmoji(vehicleId)}</span>
                                    {(qty as number) > 1 && (
                                      <span className="text-xs font-semibold text-gray-600">×{qty as number}</span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Route */}
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2 w-1/2">Route</div>
                        <div className="flex gap-4 items-stretch">
                          {/* Route list – left half */}
                          <div className="w-1/2 space-y-2">
                            {locs.map((location, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`size-3 rounded-full ${
                                      index === 0
                                        ? "bg-green-500"
                                        : index === locs.length - 1
                                          ? "bg-red-500"
                                          : "bg-blue-500"
                                    }`}
                                  />
                                  {index < locs.length - 1 && (
                                    <div className="w-0.5 h-8 bg-gray-300 my-1" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{location}</p>
                                  {index === 0 && (
                                    <span className="text-xs text-gray-500">Starting point</span>
                                  )}
                                  {index === locs.length - 1 && (
                                    <span className="text-xs text-gray-500">Final destination</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Mock map – right half */}
                          <div className="w-1/2 rounded-xl overflow-hidden border border-gray-200 relative min-h-[140px]">
                            <svg
                              viewBox="0 0 220 160"
                              className="w-full h-full absolute inset-0"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              {/* Map tile background */}
                              <rect width="220" height="160" fill="#e8ede8" />

                              {/* Grid overlay */}
                              {[20,40,60,80,100,120,140,160,180,200].map(x => (
                                <line key={`vg-${x}`} x1={x} y1="0" x2={x} y2="160" stroke="#d5dfd5" strokeWidth="0.5" />
                              ))}
                              {[20,40,60,80,100,120,140].map(y => (
                                <line key={`hg-${y}`} x1="0" y1={y} x2="220" y2={y} stroke="#d5dfd5" strokeWidth="0.5" />
                              ))}

                              {/* Mock road network */}
                              <line x1="0" y1="80" x2="220" y2="80" stroke="#fff" strokeWidth="4" />
                              <line x1="0" y1="80" x2="220" y2="80" stroke="#c8d4c0" strokeWidth="1.5" strokeDasharray="6 3" />
                              <line x1="110" y1="0" x2="110" y2="160" stroke="#fff" strokeWidth="4" />
                              <line x1="110" y1="0" x2="110" y2="160" stroke="#c8d4c0" strokeWidth="1.5" strokeDasharray="6 3" />
                              <line x1="0" y1="30" x2="220" y2="130" stroke="#fff" strokeWidth="3" />
                              <line x1="0" y1="130" x2="220" y2="30" stroke="#fff" strokeWidth="2.5" />

                              {/* Mock building blocks */}
                              {([
                                [15,15,24,18],[50,10,20,16],[140,8,22,16],[170,12,28,18],
                                [10,50,18,20],[140,50,20,18],[175,50,30,20],[10,100,22,16],
                                [85,100,18,16],[150,105,24,18],[10,130,20,14],[170,130,28,16],
                              ] as [number,number,number,number][]).map(([x,y,w,h], i) => (
                                <rect key={`b-${i}`} x={x} y={y} width={w} height={h} fill="#ccd8cc" rx="1.5" />
                              ))}

                              {/* Dynamic route path + markers */}
                              {(() => {
                                const n = locs.length;
                                const pts = locs.map((_, i) => ({
                                  x: Math.round(185 - (i / Math.max(n - 1, 1)) * 150),
                                  y: Math.round(22  + (i / Math.max(n - 1, 1)) * 116),
                                }));
                                const pathD = pts.reduce((d, pt, i) => {
                                  if (i === 0) return `M${pt.x},${pt.y}`;
                                  const prev = pts[i - 1];
                                  const cpx = (prev.x + pt.x) / 2;
                                  return `${d} C${cpx},${prev.y} ${cpx},${pt.y} ${pt.x},${pt.y}`;
                                }, "");
                                return (
                                  <>
                                    <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="5" strokeOpacity="0.15" strokeLinecap="round" />
                                    <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 3" />
                                    {pts.map((pt, i) => {
                                      const fill = i === 0 ? "#22c55e" : i === n - 1 ? "#ef4444" : "#3b82f6";
                                      const label = String.fromCharCode(65 + i);
                                      return (
                                        <g key={`mk-${i}`}>
                                          <circle cx={pt.x} cy={pt.y + 1} r="7" fill="#000" fillOpacity="0.12" />
                                          <circle cx={pt.x} cy={pt.y} r="7" fill={fill} />
                                          <circle cx={pt.x} cy={pt.y} r="7" fill="none" stroke="#fff" strokeWidth="1.5" />
                                          <text x={pt.x} y={pt.y + 4} textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#fff" fontFamily="sans-serif">{label}</text>
                                        </g>
                                      );
                                    })}
                                  </>
                                );
                              })()}

                              {/* Watermark bar */}
                              <rect x="0" y="149" width="220" height="11" fill="#fff" fillOpacity="0.55" />
                              <text x="110" y="157" textAnchor="middle" fontSize="5.5" fill="#888" fontFamily="sans-serif">Route preview (mock data)</text>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Date / Passengers / Luggage */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="size-4" />
                            <span className="text-sm font-medium text-gray-700">Date</span>
                          </div>
                          <div className="text-sm">
                            {td.isFlexibleDates
                              ? `${td.selectedMonth} (${td.numberOfDays})`
                              : td.dateRange.from && td.dateRange.to
                                ? `${format(new Date(td.dateRange.from), "MMM dd, yyyy")} – ${format(new Date(td.dateRange.to), "MMM dd, yyyy")}`
                                : "Dates not specified"}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 border-l pl-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="size-4" />
                            <span className="text-sm font-medium text-gray-700">Passengers</span>
                          </div>
                          <div className="text-sm">
                            {td.passengers} Passenger{td.passengers !== "1" ? "s" : ""}
                          </div>
                        </div>
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
                  );
                };

                return (
                  <>
                    <h2 className="text-lg font-semibold mb-4 pb-4 border-b border-gray-200">{tripData.tripName} - Trip Details</h2>

                    {isMultiTab ? (
                      <div>
                        {tabEntries.map(([tabId, rec], i) =>
                          renderTripSection(
                            tabId,
                            `Part ${i + 1}`,
                            rec.tripData,
                            rec.additionalDestinations,
                            i === tabEntries.length - 1
                          )
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Route */}
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Route</div>
                          <div className="space-y-2">
                            {allLocations.map((location, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`size-3 rounded-full ${
                                      index === 0
                                        ? "bg-green-500"
                                        : index === allLocations.length - 1
                                          ? "bg-red-500"
                                          : "bg-blue-500"
                                    }`}
                                  />
                                  {index < allLocations.length - 1 && (
                                    <div className="w-0.5 h-8 bg-gray-300 my-1" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{location}</p>
                                  {index === 0 && (
                                    <span className="text-xs text-gray-500">Starting point</span>
                                  )}
                                  {index === allLocations.length - 1 && (
                                    <span className="text-xs text-gray-500">Final destination</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Date / Passengers / Luggage */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
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
                          <div className="flex flex-col gap-1 border-l pl-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="size-4" />
                              <span className="text-sm font-medium text-gray-700">Passengers</span>
                            </div>
                            <div className="text-sm">
                              {tripData.passengers} Passenger{tripData.passengers !== "1" ? "s" : ""}
                            </div>
                          </div>
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
                    )}
                  </>
                );
              })()}
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
                {Object.entries(selectedVehicles).flatMap(
                  ([vehicleId, quantity]) => {
                    const vehicle = vehicles.find(
                      (v) => v.id === vehicleId,
                    );
                    if (!vehicle) return [];

                    const rate =
                      estimatedHours >= 5
                        ? vehicle.fullDayRate
                        : vehicle.hourlyRate * estimatedHours;

                    return Array.from({ length: quantity }, (_, i) => (
                      <div
                        key={`${vehicleId}-${i}`}
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
                            {quantity > 1 && (
                              <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">
                                #{i + 1} of {quantity}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mt-0.5">
                            {vehicle.passengerCapacity} passengers · {vehicle.luggageCapacity} bags
                          </div>
                          <div className="text-sm text-gray-600 mt-0.5">
                            {estimatedHours >= 5 ? "Full day rate" : `${estimatedHours}h rate`}
                          </div>
                        </div>
                        <div className="font-semibold">
                          ${rate.toFixed(2)}
                        </div>
                      </div>
                    ));
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
                <div>
                  <p className="font-semibold text-gray-800 mb-1">1. Booking Request and Estimated Pricing</p>
                  <p className="text-gray-600 leading-relaxed">When you click "Confirm Booking", your request will be submitted to our team together with an estimated price range or average price generated by our system based on the details of your itinerary. This estimate is provided for informational purposes only and does not constitute a final quotation or confirmed price. All bookings are subject to manual review and approval by our team.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">2. Final Quotation</p>
                  <p className="text-gray-600 leading-relaxed mb-1">After reviewing your booking request, our team will prepare a final confirmed quotation based on the details of your itinerary. This quotation may reflect factors including but not limited to:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>Trip duration</li>
                    <li>Travel distance</li>
                    <li>Number of passengers</li>
                    <li>Stops or itinerary adjustments</li>
                    <li>Vehicle type or service level</li>
                    <li>Applicable tolls, taxes, parking, or surcharges</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-1">You will receive the final quotation together with a secure payment link to complete your booking. Your booking is not confirmed until full payment has been received.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">3. Full Payment Requirement</p>
                  <p className="text-gray-600 leading-relaxed">To confirm your reservation, full payment of the quoted amount is required at the time of checkout through the payment link. By completing payment through the provided link, you authorize the full charge to your selected payment method for the amount shown in the final quotation. Payments are processed securely by our payment processor, such as Stripe, and your payment details are not stored directly on our servers.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">4. Refund and Cancellation Policy</p>
                  <p className="text-gray-600 leading-relaxed mb-1">Customers may cancel their booking and request a refund up to five (5) days before the first scheduled day of service. If a cancellation is requested within this period:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>The booking will be canceled.</li>
                    <li>A refund will be issued to the original payment method.</li>
                    <li>A 3.7% processing fee will be deducted from the refunded amount to cover non-refundable merchant transaction fees charged by the payment processor.</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-1">Example: If the total payment was $1,000, the refunded amount would be $963, reflecting the 3.7% processing fee.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">5. Cancellations Within Five (5) Days of Service</p>
                  <p className="text-gray-600 leading-relaxed">Cancellations made within five (5) days of the scheduled trip start date are non-refundable, as vehicles, drivers, and scheduling resources will have already been reserved and allocated for your service.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">6. Changes to Bookings</p>
                  <p className="text-gray-600 leading-relaxed mb-1">If you request changes to your itinerary after payment has been made, we will make reasonable efforts to accommodate the request. However:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>Additional charges may apply for changes that increase service time, travel distance, or requested services.</li>
                    <li>If additional costs are incurred, a separate payment request may be issued.</li>
                    <li>Changes are subject to availability and operational feasibility.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">7. Waiting Time Policy</p>
                  <p className="text-gray-600 leading-relaxed mb-1">Drivers will wait for passengers at the scheduled pickup location for a reasonable period of time. Waiting time allowances may vary depending on the type of pickup location, including:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>Airports</li>
                    <li>Hotels</li>
                    <li>Private residences</li>
                    <li>Other designated pickup points</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-1">If passengers do not arrive within the allotted waiting time, additional waiting charges may apply or the trip may be considered a no-show, in which case the booking may be canceled without refund.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">8. Passenger Conduct and Refusal of Transportation</p>
                  <p className="text-gray-600 leading-relaxed mb-1">We may refuse to accept or continue transportation in any of the following cases:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>The request is not made in accordance with these Terms.</li>
                    <li>No appropriate vehicle or equipment is available for the requested transport.</li>
                    <li>The requester demands special burdens beyond standard service.</li>
                    <li>The transport would violate applicable laws, public order, or good morals.</li>
                    <li>Transportation is hindered by natural disasters or other unavoidable circumstances.</li>
                    <li>The passenger does not comply with instructions given by the driver under relevant transport regulations.</li>
                    <li>The passenger is carrying items prohibited under transport regulations.</li>
                    <li>The passenger is so intoxicated that they cannot clearly state their destination or walk without assistance.</li>
                    <li>The passenger is wearing clothing likely to excessively soil or damage the vehicle.</li>
                    <li>The passenger is seriously ill and unaccompanied.</li>
                    <li>The passenger is suspected to have a Class I, Class II, or designated infectious disease requiring hospitalization under applicable infectious disease control laws.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">9. Smoking Ban</p>
                  <p className="text-gray-600 leading-relaxed">In vehicles designated as non-smoking vehicles, passengers must refrain from smoking. If a passenger smokes or attempts to smoke in a non-smoking vehicle, the driver may request that the passenger stop immediately. If the passenger refuses to comply, transportation may be refused or discontinued.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">10. Vehicle Damage and Cleaning Responsibility</p>
                  <p className="text-gray-600 leading-relaxed mb-1">Passengers are responsible for any damage caused to the vehicle during transportation. Passengers may also be charged for excessive cleaning if the vehicle requires special cleaning due to passenger actions, including but not limited to:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>Spills</li>
                    <li>Food waste</li>
                    <li>Mud or sand</li>
                    <li>Smoking</li>
                    <li>Bodily fluids</li>
                    <li>Other conditions requiring professional cleaning</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-1">Any such charges may be billed to the customer responsible for the booking.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">11. Lost Property</p>
                  <p className="text-gray-600 leading-relaxed">Passengers are responsible for ensuring that all personal belongings are removed from the vehicle upon completion of the trip. Zengo Co., Ltd. is not responsible for items left behind in vehicles. However, if an item is reported lost, we will make reasonable efforts to assist in locating and returning the item if possible.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">12. Force Majeure</p>
                  <p className="text-gray-600 leading-relaxed mb-1">We shall not be liable for any delay, interruption, or failure to perform services due to circumstances beyond our reasonable control. Such circumstances may include, but are not limited to:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>Severe weather conditions</li>
                    <li>Traffic accidents or road closures</li>
                    <li>Natural disasters</li>
                    <li>Government restrictions or regulations</li>
                    <li>Strikes or labor disputes</li>
                    <li>Public health emergencies</li>
                    <li>Other unforeseen events affecting transportation services</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-1">In such cases, we will make reasonable efforts to provide alternative arrangements or reschedule services where possible.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">13. Limitation of Liability</p>
                  <p className="text-gray-600 leading-relaxed">To the fullest extent permitted by law, Zengo Co., Ltd. shall not be liable for indirect, incidental, or consequential damages arising from the use of our services. Our total liability for any claim relating to a booking shall not exceed the total amount paid for that booking.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">14. Payment Disputes</p>
                  <p className="text-gray-600 leading-relaxed">If you believe a charge was made in error, you agree to contact us directly at <a href="mailto:sosuke.b@go-ride.jp" className="text-blue-600 hover:underline">sosuke.b@go-ride.jp</a> before initiating a chargeback or dispute with your bank or card issuer so that we may investigate and resolve the matter promptly.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">15. Acceptance of Terms</p>
                  <p className="text-gray-600 leading-relaxed mb-1">By clicking "Confirm Booking", submitting your booking request, and completing payment through the payment link, you acknowledge and agree that:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-600">
                    <li>The initial price displayed during booking is only an estimate.</li>
                    <li>Your booking request will be reviewed and approved before a final quotation is issued.</li>
                    <li>Your reservation is confirmed only after full payment of the final quotation.</li>
                    <li>Refunds are available up to five (5) days before the first scheduled day of service, subject to a 3.7% transaction processing fee.</li>
                    <li>Cancellations within five (5) days of service are non-refundable.</li>
                    <li>Transportation may be refused in certain circumstances described in these Terms.</li>
                    <li>You agree to these Payment Authorization &amp; Booking Terms.</li>
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