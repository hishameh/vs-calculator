import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ArchitectFeeCalculator from "./components/ArchitectFeeCalculator";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <div className="bg-[#f0ede8] min-h-screen">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/architect-fee" element={<ArchitectFeeCalculator />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
