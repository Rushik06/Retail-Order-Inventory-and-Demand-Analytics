import useInventoryAlerts from "./hooks/InventoryAlerthooks";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";

function App() {

   useInventoryAlerts();

  return (
    <div className="min-h-screen w-full ">
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </div>
  );
}

export default App;