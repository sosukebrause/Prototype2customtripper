import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format } from "date-fns";
import {
  MapPin,
  User,
  Briefcase,
  Plus,
  Minus,
  X,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Tv,
  Wind,
  Bluetooth,
  Clock,
  Edit,
  GripVertical,
  Search,
  Trash2,
  Check,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

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
  imageUrl: string;
  passengerCapacity: number;
  luggageCapacity: number;
  features: string[];
  description: string;
};

type LocationItem = {
  id: string;
  label: string;
  isStartLocation?: boolean;
  isMainDestination?: boolean;
};

const vehicles: VehicleOption[] = [
  {
    id: "comfort-van",
    name: "Comfort Van",
    hourlyRate: 95,
    fullDayRate: 420,
    imageUrl: "https://images.unsplash.com/photo-1692279952778-00ce5c3ce02c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb21mb3J0JTIwdmFufGVufDF8fHx8MTc3MTkxNDQ3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    passengerCapacity: 7,
    luggageCapacity: 4,
    features: ["WiFi", "TV", "2-Zone Climate", "Bluetooth"],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis.",
  },
  {
    id: "premium-van",
    name: "Premium Van",
    hourlyRate: 110,
    fullDayRate: 580,
    imageUrl: "https://images.unsplash.com/photo-1771248647341-9d8f567b051d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2YW4lMjB0cmFuc3BvcnRhdGlvbnxlbnwxfHx8fDE3NzE5MTQ0ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    passengerCapacity: 7,
    luggageCapacity: 5,
    features: ["WiFi", "TV", "2-Zone Climate", "Bluetooth"],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis.",
  },
  {
    id: "luxury-sedan",
    name: "Luxury Sedan",
    hourlyRate: 125,
    fullDayRate: 650,
    imageUrl: "https://images.unsplash.com/photo-1763789381177-cd8a04aaa2ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NzE4MjAyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    passengerCapacity: 4,
    luggageCapacity: 3,
    features: ["WiFi", "TV", "2-Zone Climate", "Bluetooth"],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis.",
  },
  {
    id: "crossover-suv",
    name: "Crossover SUV",
    hourlyRate: 85,
    fullDayRate: 450,
    imageUrl: "https://images.unsplash.com/photo-1767949374180-e5895daa1990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9zc292ZXIlMjBTVVYlMjB2ZWhpY2xlfGVufDF8fHx8MTc3MTkxNDQ3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    passengerCapacity: 5,
    luggageCapacity: 3,
    features: ["WiFi", "TV", "2-Zone Climate", "Bluetooth"],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis.",
  },
];

// Draggable Location Item Component
interface DraggableLocationProps {
  location: LocationItem;
  index: number;
  moveLocation: (dragIndex: number, hoverIndex: number) => void;
  removeLocation: (index: number) => void;
  isEditMode: boolean;
  editingLocationId: string | null;
  onStartEdit: (locationId: string, currentValue: string) => void;
  onSaveEdit: (locationId: string, newValue: string) => void;
  onCancelEdit: () => void;
  editingLocationValue: string;
  onEditingValueChange: (value: string) => void;
}

function DraggableLocation({
  location,
  index,
  moveLocation,
  removeLocation,
  isEditMode,
  editingLocationId,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  editingLocationValue,
  onEditingValueChange,
}: DraggableLocationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isEditing = editingLocationId === location.id;

  const [{ handlerId }, drop] = useDrop({
    accept: "location",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveLocation(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: "location",
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditMode && !isEditing,
  });

  const opacity = isDragging ? 0.5 : 1;
  
  // Combine drag and drop refs
  drag(drop(ref));

  return (
    <div ref={preview} style={{ opacity }} data-handler-id={handlerId}>
      <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg relative">
        {isEditMode && !isEditing && (
          <button
            className="absolute -left-2 -top-2 size-6 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 z-10"
            onClick={() => removeLocation(index)}
          >
            <X className="size-4" />
          </button>
        )}
        <MapPin className="size-5 text-gray-600 flex-shrink-0" />
        
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <GooglePlacesAutocomplete
                value={editingLocationValue}
                onChange={onEditingValueChange}
                onPlaceSelected={(place) => {
                  if (place.formatted_address) {
                    onEditingValueChange(place.formatted_address);
                  }
                }}
                className="w-full py-1 px-2"
                placeholder="Enter new location"
              />
            </div>
            <button
              onClick={onCancelEdit}
              className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => onSaveEdit(location.id, editingLocationValue)}
              disabled={!editingLocationValue.trim()}
              className="text-xs px-2 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <div
              className={`flex-1 font-medium ${isEditMode ? 'cursor-pointer hover:text-blue-600' : ''}`}
              onClick={() => {
                if (isEditMode) {
                  onStartEdit(location.id, location.label);
                }
              }}
            >
              {location.label}
            </div>
            {isEditMode && (
              <div ref={ref} className="cursor-move">
                <GripVertical className="size-5 text-gray-400" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function VehicleSelectionContent() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<Record<string, number>>({});
  const [detailsVehicle, setDetailsVehicle] = useState<VehicleOption | null>(null);
  const [detailsQuantity, setDetailsQuantity] = useState(1);
  const [isAddDestinationOpen, setIsAddDestinationOpen] = useState(false);
  const [newDestination, setNewDestination] = useState("");
  const [additionalDestinations, setAdditionalDestinations] = useState<string[]>([]);
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalLocations, setOriginalLocations] = useState<LocationItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [editingLocationValue, setEditingLocationValue] = useState("");
  
  // Passenger details states
  const [luggageCount, setLuggageCount] = useState(2);
  const [isEditingPassengerDetails, setIsEditingPassengerDetails] = useState(false);
  const [tempPassengers, setTempPassengers] = useState("1");
  const [tempLuggage, setTempLuggage] = useState(2);

  // Date edit states
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [tempIsFlexibleDates, setTempIsFlexibleDates] = useState(false);
  const [tempSelectedMonth, setTempSelectedMonth] = useState("");
  const [tempNumberOfDays, setTempNumberOfDays] = useState("");

  // Tab management states
  const [activeTabId, setActiveTabId] = useState<string>("trip-1");
  const [tripRecords, setTripRecords] = useState<Record<string, {
    tripData: TripData;
    additionalDestinations: string[];
    selectedVehicles: Record<string, number>;
  }>>({});
  const [isDraftTab, setIsDraftTab] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [draftStartLocation, setDraftStartLocation] = useState("");
  const [draftDestination, setDraftDestination] = useState("");

  useEffect(() => {
    const data = sessionStorage.getItem("tripData");
    if (data) {
      const parsed = JSON.parse(data);
      setTripData(parsed);
      
      // Initialize locations
      const initialLocations: LocationItem[] = [
        { id: "start", label: parsed.startLocation, isStartLocation: true },
        { id: "destination", label: parsed.destination, isMainDestination: true },
      ];
      setLocations(initialLocations);
      setOriginalLocations(initialLocations);
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Update locations when additional destinations change
  useEffect(() => {
    if (tripData) {
      const baseLocations: LocationItem[] = [
        { id: "start", label: tripData.startLocation, isStartLocation: true },
        { id: "destination", label: tripData.destination, isMainDestination: true },
      ];
      const additionalLocs = additionalDestinations.map((dest, index) => ({
        id: `additional-${index}`,
        label: dest,
      }));
      setLocations([...baseLocations, ...additionalLocs]);
      if (!isEditMode) {
        setOriginalLocations([...baseLocations, ...additionalLocs]);
      }
    }
  }, [additionalDestinations, tripData, isEditMode]);

  if (!tripData) {
    return null;
  }

  const handleCheckboxChange = (vehicleId: string, checked: boolean) => {
    setSelectedVehicles((prev) => {
      const newState = { ...prev };
      if (checked) {
        newState[vehicleId] = 1;
      } else {
        delete newState[vehicleId];
      }
      return newState;
    });
  };

  const handleQuantityChange = (vehicleId: string, delta: number) => {
    setSelectedVehicles((prev) => {
      const currentQty = prev[vehicleId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      const newState = { ...prev };
      if (newQty === 0) {
        delete newState[vehicleId];
      } else {
        newState[vehicleId] = newQty;
      }
      return newState;
    });
  };

  const openDetails = (vehicle: VehicleOption) => {
    setDetailsVehicle(vehicle);
    setDetailsQuantity(selectedVehicles[vehicle.id] || 1);
  };

  const handleUpdateVehicle = () => {
    if (detailsVehicle) {
      setSelectedVehicles((prev) => ({
        ...prev,
        [detailsVehicle.id]: detailsQuantity,
      }));
      setDetailsVehicle(null);
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "WiFi":
        return <Wifi className="size-4" />;
      case "TV":
        return <Tv className="size-4" />;
      case "2-Zone Climate":
        return <Wind className="size-4" />;
      case "Bluetooth":
        return <Bluetooth className="size-4" />;
      default:
        return null;
    }
  };

  const moveLocation = (dragIndex: number, hoverIndex: number) => {
    const dragLocation = locations[dragIndex];
    const newLocations = [...locations];
    newLocations.splice(dragIndex, 1);
    newLocations.splice(hoverIndex, 0, dragLocation);
    setLocations(newLocations);
  };

  const removeLocation = (index: number) => {
    const newLocations = locations.filter((_, i) => i !== index);
    setLocations(newLocations);
  };

  const handleEditClick = () => {
    setOriginalLocations([...locations]);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setLocations([...originalLocations]);
    setIsEditMode(false);
    setEditingLocationId(null);
    setEditingLocationValue("");
  };

  const handleStartEditLocation = (locationId: string, currentValue: string) => {
    setEditingLocationId(locationId);
    setEditingLocationValue(currentValue);
  };

  const onSaveEdit = (locationId: string, newValue: string) => {
    if (!newValue.trim()) return;
    
    const updatedLocations = locations.map(loc => 
      loc.id === locationId ? { ...loc, label: newValue } : loc
    );
    setLocations(updatedLocations);
    setEditingLocationId(null);
    setEditingLocationValue("");
  };

  const handleSaveEdit = () => {
    if (locations.length === 0) {
      setIsEditMode(false);
      return;
    }

    // Update trip data based on new location order
    const updatedTripData = { ...tripData };
    
    // First location becomes start location
    if (locations[0]) {
      updatedTripData.startLocation = locations[0].label;
    }
    
    // Second location becomes destination (if exists)
    if (locations[1]) {
      updatedTripData.destination = locations[1].label;
    } else {
      // If only one location exists, it becomes both start and destination
      updatedTripData.destination = locations[0].label;
    }
    
    // Remaining locations become additional destinations
    const newAdditionalDests = locations.slice(2).map(loc => loc.label);
    
    setTripData(updatedTripData);
    setAdditionalDestinations(newAdditionalDests);
    
    // Update session storage with new trip data
    sessionStorage.setItem("tripData", JSON.stringify(updatedTripData));
    
    setIsEditMode(false);
  };

  const handleStartEditPassengerDetails = () => {
    setTempPassengers(tripData.passengers);
    setTempLuggage(luggageCount);
    setIsEditingPassengerDetails(true);
  };

  const handleSavePassengerDetails = () => {
    const updatedTripData = { ...tripData, passengers: tempPassengers };
    setTripData(updatedTripData);
    setLuggageCount(tempLuggage);
    sessionStorage.setItem("tripData", JSON.stringify(updatedTripData));
    setIsEditingPassengerDetails(false);
  };

  const handleCancelPassengerDetails = () => {
    setTempPassengers(tripData.passengers);
    setTempLuggage(luggageCount);
    setIsEditingPassengerDetails(false);
  };

  const handleStartEditDate = () => {
    // Store current values in temp states
    if (tripData.dateRange.from && tripData.dateRange.to) {
      setTempDateRange({
        from: new Date(tripData.dateRange.from),
        to: new Date(tripData.dateRange.to),
      });
    } else {
      setTempDateRange({ from: undefined, to: undefined });
    }
    setTempIsFlexibleDates(tripData.isFlexibleDates);
    setTempSelectedMonth(tripData.selectedMonth);
    setTempNumberOfDays(tripData.numberOfDays);
    setIsEditingDate(true);
  };

  const handleSaveDate = () => {
    const updatedTripData = {
      ...tripData,
      dateRange: {
        from: tempDateRange.from?.toISOString(),
        to: tempDateRange.to?.toISOString(),
      },
      isFlexibleDates: tempIsFlexibleDates,
      selectedMonth: tempSelectedMonth,
      numberOfDays: tempNumberOfDays,
    };
    setTripData(updatedTripData);
    sessionStorage.setItem("tripData", JSON.stringify(updatedTripData));
    setIsEditingDate(false);
  };

  const handleCancelDate = () => {
    // Reset temp values
    if (tripData.dateRange.from && tripData.dateRange.to) {
      setTempDateRange({
        from: new Date(tripData.dateRange.from),
        to: new Date(tripData.dateRange.to),
      });
    } else {
      setTempDateRange({ from: undefined, to: undefined });
    }
    setTempIsFlexibleDates(tripData.isFlexibleDates);
    setTempSelectedMonth(tripData.selectedMonth);
    setTempNumberOfDays(tripData.numberOfDays);
    setIsEditingDate(false);
  };

  const handleUndecided = () => {
    // Revert to flexible dates with original values
    setTempDateRange({ from: undefined, to: undefined });
    setTempIsFlexibleDates(true);
  };

  const handleCreateNewTrip = () => {
    // Save current trip to records if not already a draft
    if (!isDraftTab) {
      setTripRecords(prev => ({
        ...prev,
        [activeTabId]: {
          tripData,
          additionalDestinations,
          selectedVehicles,
        }
      }));
    }

    // Create new trip with default data
    const newTripId = `trip-${Date.now()}`;
    const defaultTripData: TripData = {
      tripName: `Trip ${Object.keys(tripRecords).length + 2}`,
      startLocation: "",
      destination: "",
      dateRange: { from: undefined, to: undefined },
      isFlexibleDates: false,
      selectedMonth: "",
      numberOfDays: "",
      passengers: "1",
    };
    
    setActiveTabId(newTripId);
    setTripData(defaultTripData);
    setAdditionalDestinations([]);
    setSelectedVehicles({});
    setLocations([]);
    setIsDraftTab(true);
    setDraftStartLocation("");
    setDraftDestination("");
  };

  const handleSaveDraftTrip = () => {
    // Update trip data with draft locations
    const updatedTripData = {
      ...tripData,
      startLocation: draftStartLocation,
      destination: draftDestination,
    };
    
    // Save to records
    setTripRecords(prev => ({
      ...prev,
      [activeTabId]: {
        tripData: updatedTripData,
        additionalDestinations,
        selectedVehicles,
      }
    }));
    
    setTripData(updatedTripData);
    setLocations([
      { id: "start", label: draftStartLocation, isStartLocation: true },
      { id: "destination", label: draftDestination, isMainDestination: true },
    ]);
    setIsDraftTab(false);
    sessionStorage.setItem("tripData", JSON.stringify(updatedTripData));
  };

  const handleDiscardDraftTrip = () => {
    const hasBothLocations = draftStartLocation.trim() !== "" && draftDestination.trim() !== "";
    
    if (hasBothLocations) {
      // Show confirmation dialog
      setIsDiscardDialogOpen(true);
    } else {
      // Delete tab immediately
      confirmDiscardDraftTrip();
    }
  };

  const confirmDiscardDraftTrip = () => {
    // Remove the draft tab and switch to trip-1
    const remainingRecords = { ...tripRecords };
    delete remainingRecords[activeTabId];
    setTripRecords(remainingRecords);
    
    // Switch to trip-1
    setActiveTabId("trip-1");
    
    // Load trip-1 data from session storage
    const data = sessionStorage.getItem("tripData");
    if (data) {
      const parsed = JSON.parse(data);
      setTripData(parsed);
      const initialLocations: LocationItem[] = [
        { id: "start", label: parsed.startLocation, isStartLocation: true },
        { id: "destination", label: parsed.destination, isMainDestination: true },
      ];
      setLocations(initialLocations);
      setOriginalLocations(initialLocations);
    }
    
    setIsDraftTab(false);
    setIsDiscardDialogOpen(false);
    setDraftStartLocation("");
    setDraftDestination("");
  };

  const handleSwitchTab = (tabId: string) => {
    // Save current trip to records
    setTripRecords(prev => ({
      ...prev,
      [activeTabId]: {
        tripData,
        additionalDestinations,
        selectedVehicles,
      }
    }));

    // Load selected trip
    const selectedTrip = tripRecords[tabId];
    if (selectedTrip) {
      setTripData(selectedTrip.tripData);
      setAdditionalDestinations(selectedTrip.additionalDestinations);
      setSelectedVehicles(selectedTrip.selectedVehicles);
    }
    setActiveTabId(tabId);
  };

  const handleDeleteTrip = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTrip = () => {
    // Remove the trip from records
    const remainingRecords = { ...tripRecords };
    delete remainingRecords[activeTabId];
    setTripRecords(remainingRecords);
    
    // Switch to trip-1
    setActiveTabId("trip-1");
    
    // Load trip-1 data from session storage
    const data = sessionStorage.getItem("tripData");
    if (data) {
      const parsed = JSON.parse(data);
      setTripData(parsed);
      const initialLocations: LocationItem[] = [
        { id: "start", label: parsed.startLocation, isStartLocation: true },
        { id: "destination", label: parsed.destination, isMainDestination: true },
      ];
      setLocations(initialLocations);
      setOriginalLocations(initialLocations);
    }
    
    setIsDeleteDialogOpen(false);
  };

  const tabIds = ["trip-1"];
  if (Object.keys(tripRecords).length > 0) {
    Object.keys(tripRecords).forEach(id => {
      if (!tabIds.includes(id)) {
        tabIds.push(id);
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Trip summary */}
          <div className="lg:col-span-1">
            {/* Tabs */}
            <div className="flex items-center gap-1 mb-2 bg-slate-700 p-1 rounded-t-lg">
              {tabIds.map((tabId) => (
                <button
                  key={tabId}
                  onClick={() => handleSwitchTab(tabId)}
                  className={`px-4 py-2 text-sm rounded transition-colors ${
                    activeTabId === tabId
                      ? "bg-white text-gray-900"
                      : "text-white hover:bg-slate-600"
                  }`}
                >
                  {tripRecords[tabId]?.tripData.tripName || tripData.tripName}
                </button>
              ))}
              <button
                onClick={handleCreateNewTrip}
                className="ml-auto size-8 flex items-center justify-center rounded hover:bg-slate-600 text-white transition-colors"
              >
                <Plus className="size-4" />
              </button>
            </div>
            
            <Card className="p-6 rounded-t-none relative">
              {/* Delete button - only for Trip 2+ */}
              {activeTabId !== "trip-1" && !isDraftTab && (
                <button
                  onClick={handleDeleteTrip}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  aria-label="Delete trip"
                >
                  <Trash2 className="size-5" />
                </button>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{tripData.tripName}</h2>
                {isDraftTab && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleDiscardDraftTrip}
                      className="text-sm px-3 py-1 text-red-600 hover:text-red-700 border border-red-300 rounded-md"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSaveDraftTrip}
                      disabled={!draftStartLocation || !draftDestination}
                      className="text-sm px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
              
              {isDraftTab ? (
                <div className="space-y-4">
                  {/* Starting Location Field */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Starting Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 z-10 pointer-events-none" />
                      <GooglePlacesAutocomplete
                        value={draftStartLocation}
                        onChange={setDraftStartLocation}
                        onPlaceSelected={(place) => {
                          if (place.formatted_address) {
                            setDraftStartLocation(place.formatted_address);
                          }
                        }}
                        className="w-full pl-10 pr-4 py-3"
                        placeholder="Enter starting location"
                      />
                    </div>
                  </div>

                  {/* Destination Field */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Destination *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 z-10 pointer-events-none" />
                      <GooglePlacesAutocomplete
                        value={draftDestination}
                        onChange={setDraftDestination}
                        onPlaceSelected={(place) => {
                          if (place.formatted_address) {
                            setDraftDestination(place.formatted_address);
                          }
                        }}
                        className="w-full pl-10 pr-4 py-3"
                        placeholder="Enter destination"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 italic">
                    * Both locations are required to save this trip
                  </p>
                </div>
              ) : (
                <>
                  {/* Locations Section */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">Route</h3>
                      {!isEditMode ? (
                        <button
                          onClick={handleEditClick}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <Edit className="size-4" />
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleCancelEdit}
                            className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="text-xs px-2 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {locations.map((location, index) => (
                        <div key={location.id}>
                          {index > 0 && (
                            <div className="flex items-center gap-2 pl-3 text-sm text-gray-600">
                              <Clock className="size-4 text-gray-400" />
                              <span>~{index === 1 ? "45" : "30"} min</span>
                            </div>
                          )}
                          <DraggableLocation
                            location={location}
                            index={index}
                            moveLocation={moveLocation}
                            removeLocation={removeLocation}
                            isEditMode={isEditMode}
                            editingLocationId={editingLocationId}
                            onStartEdit={handleStartEditLocation}
                            onSaveEdit={onSaveEdit}
                            onCancelEdit={() => setEditingLocationId(null)}
                            editingLocationValue={editingLocationValue}
                            onEditingValueChange={setEditingLocationValue}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Add destination button */}
                    {!isEditMode && (
                      <button
                        className="w-full flex items-center justify-center gap-2 py-2 mt-3 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                        onClick={() => {
                          setIsAddDestinationOpen(true);
                        }}
                      >
                        <Plus className="size-4" />
                        <span>Add destination</span>
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Date */}
              {!isDraftTab && (
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-700">Date</div>
                    {!isEditingDate && !isEditMode && (
                      <button
                        onClick={handleStartEditDate}
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        <Edit className="size-4" />
                      </button>
                    )}
                    {isEditingDate && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancelDate}
                          className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveDate}
                          className="text-xs px-2 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditingDate ? (
                    <div className="space-y-3">
                      <Calendar
                        mode="range"
                        selected={{ from: tempDateRange.from, to: tempDateRange.to }}
                        onSelect={(range) => {
                          if (range) {
                            setTempDateRange({ from: range.from, to: range.to });
                            setTempIsFlexibleDates(false);
                          }
                        }}
                        numberOfMonths={1}
                        defaultMonth={
                          tripData.isFlexibleDates && tripData.selectedMonth
                            ? new Date(2026, ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(tripData.selectedMonth), 1)
                            : tempDateRange.from || new Date()
                        }
                      />
                      <button
                        onClick={handleUndecided}
                        className="w-full py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Undecided
                      </button>
                    </div>
                  ) : (
                    <div className="font-medium">
                      {tripData.isFlexibleDates ? (
                        `${tripData.selectedMonth} (Day ${tripData.numberOfDays.split(' ')[0]})`
                      ) : tripData.dateRange.from && tripData.dateRange.to ? (
                        `${format(new Date(tripData.dateRange.from), "MMM dd")} - ${format(new Date(tripData.dateRange.to), "MMM dd")}`
                      ) : (
                        "Dates not specified"
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Passenger Details */}
              {!isDraftTab && (
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-gray-700">Passenger Details</div>
                    {!isEditingPassengerDetails && !isEditMode && (
                      <button
                        onClick={handleStartEditPassengerDetails}
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        <Edit className="size-4" />
                      </button>
                    )}
                  </div>
                  
                  {isEditingPassengerDetails ? (
                    <div className="space-y-3">
                      {/* Passengers Dropdown */}
                      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <User className="size-5 text-gray-600" />
                          <span className="font-medium">Passengers</span>
                        </div>
                        <select
                          value={tempPassengers}
                          onChange={(e) => setTempPassengers(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {[...Array(15)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Luggage Dropdown */}
                      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Briefcase className="size-5 text-gray-600" />
                          <span className="font-medium">Luggage</span>
                        </div>
                        <select
                          value={tempLuggage}
                          onChange={(e) => setTempLuggage(parseInt(e.target.value))}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {[...Array(20)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Save/Cancel Buttons */}
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={handleCancelPassengerDetails}
                          className="text-sm px-3 py-1 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSavePassengerDetails}
                          className="text-sm px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-gray-600" />
                        <span className="font-medium">{tripData.passengers} Passenger{tripData.passengers !== "1" ? "s" : ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="size-4 text-gray-600" />
                        <span className="font-medium">{luggageCount} Luggage</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Right side - Vehicle options */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Select a vehicle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((vehicle) => {
                const isSelected = !!selectedVehicles[vehicle.id];
                const quantity = selectedVehicles[vehicle.id] || 0;
                
                return (
                  <Card
                    key={vehicle.id}
                    className={`overflow-hidden transition-all ${
                      isSelected ? "ring-2 ring-green-500" : ""
                    }`}
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      <ImageWithFallback
                        src={vehicle.imageUrl}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute top-3 right-3 size-8 rounded-full bg-white flex items-center justify-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(vehicle.id, !isSelected);
                        }}
                      >
                        {isSelected && (
                          <div className="size-8 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="size-5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{vehicle.name}</h3>
                      
                      {/* Icons */}
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="size-4" />
                          <span>{vehicle.passengerCapacity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="size-4" />
                          <span>{vehicle.luggageCapacity}</span>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="text-sm text-gray-600 mb-4">
                        <span>Hourly: <span className="font-semibold text-gray-900">${vehicle.hourlyRate}</span></span>
                        <span className="mx-2">|</span>
                        <span>Full Day: <span className="font-semibold text-gray-900">${vehicle.fullDayRate}</span></span>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => openDetails(vehicle)}
                        >
                          Details
                        </Button>
                        <div className="flex items-center border rounded-md">
                          <button
                            className="px-3 py-2 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(vehicle.id, -1);
                            }}
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="px-3 py-2 min-w-[40px] text-center border-x">
                            {quantity}
                          </span>
                          <button
                            className="px-3 py-2 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(vehicle.id, 1);
                            }}
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {Object.keys(selectedVehicles).length > 0 && (
              <div className="mt-6">
                <Button 
                  size="lg" 
                  className="w-full md:w-auto"
                  onClick={() => {
                    sessionStorage.setItem("selectedVehicles", JSON.stringify(selectedVehicles));
                    sessionStorage.setItem("additionalDestinations", JSON.stringify(additionalDestinations));
                    navigate("/booking");
                  }}
                >
                  Continue to Booking
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      {detailsVehicle && (
        <Dialog open={!!detailsVehicle} onOpenChange={() => setDetailsVehicle(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{detailsVehicle.name}</DialogTitle>
              <DialogDescription>
                {detailsVehicle.description}
              </DialogDescription>
            </DialogHeader>

            {/* Image Carousel */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <ImageWithFallback
                src={detailsVehicle.imageUrl}
                alt={detailsVehicle.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white">
                <ChevronLeft className="size-5" />
              </button>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white">
                <ChevronRight className="size-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="size-2 rounded-full bg-blue-600" />
                <div className="size-2 rounded-full bg-gray-300" />
                <div className="size-2 rounded-full bg-gray-300" />
              </div>
            </div>

            {/* Features */}
            <div className="mt-4">
              <h3 className="font-semibold mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <User className="size-4" />
                  <span className="text-sm">{detailsVehicle.passengerCapacity} Seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="size-4" />
                  <span className="text-sm">{detailsVehicle.luggageCapacity} Suitcases</span>
                </div>
                {detailsVehicle.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    {getFeatureIcon(feature)}
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Hourly Rate</div>
                <div className="text-2xl font-bold">${detailsVehicle.hourlyRate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Full Day (5+ hours)</div>
                <div className="text-2xl font-bold">${detailsVehicle.fullDayRate}</div>
              </div>
            </div>

            {/* Number of Vehicles */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="font-medium">Number of Vehicles</span>
              <div className="flex items-center border rounded-md bg-white">
                <button
                  className="px-3 py-2 hover:bg-gray-100"
                  onClick={() => setDetailsQuantity(Math.max(1, detailsQuantity - 1))}
                >
                  <Minus className="size-4" />
                </button>
                <span className="px-3 py-2 min-w-[40px] text-center border-x">
                  {detailsQuantity}
                </span>
                <button
                  className="px-3 py-2 hover:bg-gray-100"
                  onClick={() => setDetailsQuantity(detailsQuantity + 1)}
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setDetailsVehicle(null)}
              >
                Cancel
              </Button>
              <Button size="lg" onClick={handleUpdateVehicle}>
                Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Destination Dialog */}
      <Dialog open={isAddDestinationOpen} onOpenChange={setIsAddDestinationOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Destination</DialogTitle>
            <DialogDescription>
              Search and select a location to add to your itinerary
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Search for a location
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 z-10 pointer-events-none" />
              <GooglePlacesAutocomplete
                value={newDestination}
                onChange={setNewDestination}
                onPlaceSelected={(place) => {
                  if (place.formatted_address) {
                    setNewDestination(place.formatted_address);
                  }
                }}
                className="w-full pl-10 pr-4 py-3"
                placeholder="e.g. Tokyo Tower, Shibuya..."
              />
            </div>

            {/* Selected Destination Display */}
            {newDestination && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Selected: {newDestination}</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => {
                setIsAddDestinationOpen(false);
                setNewDestination("");
              }}
            >
              Cancel
            </Button>
            <Button 
              size="lg" 
              className="flex-1"
              disabled={!newDestination}
              onClick={() => {
                setAdditionalDestinations([...additionalDestinations, newDestination]);
                setIsAddDestinationOpen(false);
                setNewDestination("");
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Discard Draft Trip Dialog */}
      <Dialog open={isDiscardDialogOpen} onOpenChange={setIsDiscardDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Discard Draft Trip</DialogTitle>
            <DialogDescription>
              Are you sure you want to discard this draft trip? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => {
                setIsDiscardDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              size="lg" 
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDiscardDraftTrip}
            >
              Discard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Trip Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Delete Trip</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trip? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => {
                setIsDeleteDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              size="lg" 
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDeleteTrip}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function VehicleSelection() {
  return (
    <DndProvider backend={HTML5Backend}>
      <VehicleSelectionContent />
    </DndProvider>
  );
}