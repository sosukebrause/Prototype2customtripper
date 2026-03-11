import { RouterProvider } from "react-router";
import { router } from "./routes";

// Main application component
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}