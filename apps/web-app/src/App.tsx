import useInventoryAlerts from "./hooks/InventoryAlerthooks";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";

function App() {

   useInventoryAlerts();

  return (
    <div className="min-h-screen w-full max-w-[1400px] mx-auto px-4 md:px-6">
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </div>
  );
}

export default App;