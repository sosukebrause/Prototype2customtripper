import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "./Header";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { 
  MapPin, 
  Calendar, 
  Car, 
  Plus, 
  Clock,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Edit2,
  FileText,
  X,
  Check
} from "lucide-react";
import { format } from "date-fns";

const checkeredFlagImage = "https://images.unsplash.com/photo-1648907736562-b1cb3dd632dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwY2hlY2tlcmVkJTIwcGF0dGVybiUyMHRleHR1cmV8ZW58MXx8fHwxNzcxOTk5NDkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

type TripStatus = "draft" | "in-progress" | "changes-requested" | "approved" | "cancelled" | "done";

type Trip = {
  id: string;
  bookingReference?: string;
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
  vehicleCount: number;
  status: TripStatus;
  createdAt: string;
  totalPrice?: number;
};

// Mock data - in a real app, this would come from a backend
const mockTrips: Trip[] = [
  {
    id: "trip-1",
    bookingReference: "BK12345678",
    tripName: "Tokyo Business Trip",
    startLocation: "Tokyo Station Hotel",
    destination: "Narita International Airport",
    dateRange: {
      from: "2026-03-15T00:00:00.000Z",
      to: "2026-03-15T00:00:00.000Z",
    },
    isFlexibleDates: false,
    selectedMonth: "",
    numberOfDays: "",
    passengers: "3",
    vehicleCount: 1,
    status: "in-progress",
    createdAt: "2026-02-20T10:30:00.000Z",
    totalPrice: 504,
  },
  {
    id: "trip-2",
    tripName: "Kyoto Sightseeing",
    startLocation: "Kyoto Station",
    destination: "Fushimi Inari Shrine",
    dateRange: {
      from: undefined,
      to: undefined,
    },
    isFlexibleDates: true,
    selectedMonth: "Apr",
    numberOfDays: "Day 3-5",
    passengers: "2",
    vehicleCount: 1,
    status: "draft",
    createdAt: "2026-02-22T14:20:00.000Z",
  },
  {
    id: "trip-3",
    bookingReference: "BK87654321",
    tripName: "Osaka Conference",
    startLocation: "Osaka International Airport",
    destination: "Hilton Osaka Hotel",
    dateRange: {
      from: "2026-04-10T00:00:00.000Z",
      to: "2026-04-10T00:00:00.000Z",
    },
    isFlexibleDates: false,
    selectedMonth: "",
    numberOfDays: "",
    passengers: "5",
    vehicleCount: 2,
    status: "changes-requested",
    createdAt: "2026-02-18T09:15:00.000Z",
    totalPrice: 890,
  },
  {
    id: "trip-4",
    bookingReference: "BK11223344",
    tripName: "Yokohama Day Tour",
    startLocation: "Tokyo Station",
    destination: "Yokohama Chinatown",
    dateRange: {
      from: "2026-03-25T00:00:00.000Z",
      to: "2026-03-25T00:00:00.000Z",
    },
    isFlexibleDates: false,
    selectedMonth: "",
    numberOfDays: "",
    passengers: "4",
    vehicleCount: 1,
    status: "approved",
    createdAt: "2026-02-15T14:30:00.000Z",
    totalPrice: 650,
  },
  {
    id: "trip-5",
    bookingReference: "BK99887766",
    tripName: "Mt. Fuji Excursion",
    startLocation: "Shinjuku Station",
    destination: "Mt. Fuji 5th Station",
    dateRange: {
      from: "2026-02-01T00:00:00.000Z",
      to: "2026-02-01T00:00:00.000Z",
    },
    isFlexibleDates: false,
    selectedMonth: "",
    numberOfDays: "",
    passengers: "6",
    vehicleCount: 1,
    status: "done",
    createdAt: "2026-01-20T11:00:00.000Z",
    totalPrice: 780,
  },
];

const statusConfig = {
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-700",
    badgeColor: "bg-gray-100 text-gray-700 border-gray-200",
    iconBg: "bg-gray-400",
    icon: <Edit2 className="size-3" />,
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    iconBg: "bg-blue-500",
    icon: <Clock className="size-3" />,
  },
  "changes-requested": {
    label: "Changes Requested",
    color: "bg-orange-100 text-orange-700",
    badgeColor: "bg-orange-100 text-orange-700 border-orange-200",
    iconBg: "bg-orange-500",
    icon: <AlertCircle className="size-3" />,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-700",
    badgeColor: "bg-green-100 text-green-700 border-green-200",
    iconBg: "bg-green-500",
    icon: <Check className="size-3" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    badgeColor: "bg-red-100 text-red-700 border-red-200",
    iconBg: "bg-red-500",
    icon: <X className="size-3" />,
  },
  done: {
    label: "Done",
    color: "bg-green-100 text-green-700",
    badgeColor: "text-gray-800 border-gray-300",
    iconBg: "bg-gray-600",
    icon: <Check className="size-3" />,
  },
};

export function Dashboard() {
  const navigate = useNavigate();
  
  // Load trips from localStorage and merge with mock trips
  const [trips, setTrips] = useState<Trip[]>(() => {
    const savedTripsJson = localStorage.getItem("savedTrips");
    const savedTrips = savedTripsJson ? JSON.parse(savedTripsJson) : [];
    // Merge saved trips with mock trips, avoiding duplicates
    const allTrips = [...savedTrips, ...mockTrips];
    return allTrips;
  });
  
  const [filterStatus, setFilterStatus] = useState<TripStatus | "all">("all");

  const filteredTrips = filterStatus === "all" 
    ? trips 
    : trips.filter(trip => trip.status === filterStatus);

  const getStatusBadge = (status: TripStatus) => {
    const config = statusConfig[status];
    
    // Safety check in case of invalid status
    if (!config) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200">
          {status}
        </span>
      );
    }

    // Special styling for "done" status with checkered flag background
    if (status === "done") {
      return (
        <span 
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.badgeColor} relative overflow-hidden`}
          style={{
            backgroundImage: `url(${checkeredFlagImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <span className="absolute inset-0 bg-white opacity-50 rounded-full"></span>
          <span className={`size-5 rounded-full ${config.iconBg} flex items-center justify-center text-white relative z-10`}>
            {config.icon}
          </span>
          <span className="relative z-10 font-semibold">{config.label}</span>
        </span>
      );
    }
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.badgeColor}`}>
        <span className={`size-5 rounded-full ${config.iconBg} flex items-center justify-center text-white`}>
          {config.icon}
        </span>
        {config.label}
      </span>
    );
  };

  const handleCreateNewTrip = () => {
    // Clear any existing trip data
    sessionStorage.clear();
    navigate("/");
  };

  const handleEditTrip = (tripId: string) => {
    // In a real app, load the trip data and navigate to edit
    navigate("/");
  };

  const handleContinueTrip = (trip: Trip) => {
    // Load trip data into session storage and continue
    const tripData = {
      tripName: trip.tripName,
      startLocation: trip.startLocation,
      destination: trip.destination,
      dateRange: trip.dateRange,
      isFlexibleDates: trip.isFlexibleDates,
      selectedMonth: trip.selectedMonth,
      numberOfDays: trip.numberOfDays,
      passengers: trip.passengers,
    };
    sessionStorage.setItem("tripData", JSON.stringify(tripData));
    
    if (trip.status === "draft") {
      navigate("/select-vehicle");
    } else if (trip.status === "in-progress" || trip.status === "changes-requested") {
      navigate("/booking");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-1">Manage and track all your trip bookings</p>
          </div>
          <Button size="lg" onClick={handleCreateNewTrip}>
            <Plus className="size-4 mr-2" />
            New Trip
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "draft", "in-progress", "changes-requested", "approved", "cancelled", "done"].map((status) => {
            const config = status !== "all" ? statusConfig[status as TripStatus] : null;
            const count = trips.filter(t => t.status === status).length;
            
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status as TripStatus | "all")}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  filterStatus === status
                    ? config ? `${config.color} shadow-sm` : "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {config && filterStatus === status && (
                  <span className={`size-5 rounded-full ${config.iconBg} flex items-center justify-center text-white flex-shrink-0`}>
                    {config.icon}
                  </span>
                )}
                {status === "all" ? "All" : config?.label || status}
                {status !== "all" && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    filterStatus === status 
                      ? "bg-white/30" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Car className="size-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === "all" 
                ? "Create your first trip to get started" 
                : `You don't have any ${filterStatus} trips`}
            </p>
            <Button onClick={handleCreateNewTrip}>
              <Plus className="size-4 mr-2" />
              Create New Trip
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{trip.tripName}</h3>
                    {trip.bookingReference && (
                      <p className="text-xs text-gray-500">Ref: {trip.bookingReference}</p>
                    )}
                  </div>
                  {getStatusBadge(trip.status)}
                </div>

                {/* Trip Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500">Route</div>
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {trip.startLocation}
                      </div>
                      <div className="text-xs text-gray-400">↓</div>
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {trip.destination}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Date</div>
                      <div className="text-sm text-gray-900">
                        {trip.isFlexibleDates ? (
                          `${trip.selectedMonth} (${trip.numberOfDays})`
                        ) : trip.dateRange.from && trip.dateRange.to ? (
                          format(new Date(trip.dateRange.from), "MMM dd, yyyy")
                        ) : (
                          "Date TBD"
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Car className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Details</div>
                      <div className="text-sm text-gray-900">
                        {trip.passengers} passenger{trip.passengers !== "1" ? "s" : ""} • {trip.vehicleCount} vehicle{trip.vehicleCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  {trip.totalPrice && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Estimated Total</span>
                        <span className="text-lg font-bold text-blue-600">${trip.totalPrice}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {trip.status === "draft" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleContinueTrip(trip)}
                    >
                      Continue
                    </Button>
                  )}
                  {(trip.status === "in-progress" || trip.status === "changes-requested") && (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleContinueTrip(trip)}
                    >
                      {trip.status === "changes-requested" ? "Update Details" : "Complete Details"}
                    </Button>
                  )}
                  {(trip.status === "approved" || trip.status === "done") && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      View Details
                    </Button>
                  )}
                  {trip.status !== "draft" && trip.status !== "in-progress" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTrip(trip.id)}
                    >
                      <Edit className="size-4" />
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {/* Created Date */}
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                  <Clock className="size-3" />
                  Created {format(new Date(trip.createdAt), "MMM dd, yyyy")}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}