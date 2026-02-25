import { createBrowserRouter } from "react-router";
import { CreateTripForm } from "./components/CreateTripForm";
import { VehicleSelection } from "./components/VehicleSelection";
import { BookingPage } from "./components/BookingPage";
import { ConfirmationPage } from "./components/ConfirmationPage";
import { Dashboard } from "./components/Dashboard";
import { ProfilePage } from "./components/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: CreateTripForm,
  },
  {
    path: "/select-vehicle",
    Component: VehicleSelection,
  },
  {
    path: "/booking",
    Component: BookingPage,
  },
  {
    path: "/confirmation",
    Component: ConfirmationPage,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
]);