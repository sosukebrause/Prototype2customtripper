import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, Calendar, MapPin, Car } from "lucide-react";
import { format } from "date-fns";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

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

export function ConfirmationPage() {
  const navigate = useNavigate();
  const [bookingReference, setBookingReference] = useState("");
  const [tripData, setTripData] = useState<TripData | null>(null);

  useEffect(() => {
    const ref = sessionStorage.getItem("bookingReference");
    const data = sessionStorage.getItem("tripData");

    if (ref && data) {
      setBookingReference(ref);
      setTripData(JSON.parse(data));
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!tripData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="size-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="size-12 text-green-600" />
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your trip booking has been successfully created
          </p>

          {/* Booking Reference */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="text-sm text-blue-700 font-medium mb-1">Booking Reference</div>
            <div className="text-3xl font-bold text-blue-900 tracking-wider">
              {bookingReference}
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Please save this reference number for your records
            </p>
          </div>

          {/* Trip Summary */}
          <div className="border-t border-b border-gray-200 py-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h2>
            
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">Route</div>
                  <div className="text-sm text-gray-600">
                    {tripData.startLocation} → {tripData.destination}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">Date</div>
                  <div className="text-sm text-gray-600">
                    {tripData.isFlexibleDates ? (
                      `${tripData.selectedMonth} (${tripData.numberOfDays})`
                    ) : tripData.dateRange.from && tripData.dateRange.to ? (
                      `${format(new Date(tripData.dateRange.from), "MMM dd, yyyy")} - ${format(new Date(tripData.dateRange.to), "MMM dd, yyyy")}`
                    ) : (
                      "Dates not specified"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Car className="size-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">Passengers</div>
                  <div className="text-sm text-gray-600">
                    {tripData.passengers} Passenger{tripData.passengers !== "1" ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <span className="size-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm">!</span>
              Important Next Steps
            </h3>
            <ol className="text-sm text-amber-900 space-y-2 list-decimal list-inside">
              <li>Go to your <strong>Dashboard</strong> to view your saved trip</li>
              <li>Open the trip and <strong>enter additional mandatory details</strong></li>
              <li><strong>Create a User Login Account</strong> (if you haven't already)</li>
              <li><strong>Enter payment information</strong> to finalize your booking</li>
              <li>Submit your final order for confirmation</li>
            </ol>
            <p className="text-xs text-amber-700 mt-3">
              Your trip will remain in draft status until all required information is completed.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => navigate("/")}
            >
              Create Another Trip
            </Button>
            <Button
              size="lg"
              className="flex-1"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
