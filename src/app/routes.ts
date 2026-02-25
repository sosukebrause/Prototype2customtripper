import { createBrowserRouter } from "react-router";
import { CreateTripForm } from "./components/CreateTripForm";
import { VehicleSelection } from "./components/VehicleSelection";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: CreateTripForm,
  },
  {
    path: "/select-vehicle",
    Component: VehicleSelection,
  },
]);
