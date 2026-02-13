import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewItem from "./components/Restaurant Manager/NewItem";
import Login from "./Pages/login";
import ItemMenuPage from "./Pages/ItemMenuPage";
import HotelMenuPage from "./Pages/HotelMenuPage";
import ItemMenuPageCustomer from "./Pages/ItemMenuPageCustomer";
import HotelMenuCustomerPage from "./Pages/HotelMenuCustomerPage";
import Navbar from "./components/navbar";
import PaymentPage from "./Pages/PaymentPage";
import ShoppingPage from "./Pages/ShoppingPage";
import ItemView from "./components/Customer/ItemView";
import NewMenu from "./components/Restaurant Manager/NewMenu";
import QRCodeGenerate from "./components/Restaurant Manager/QRCodeGenerate";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import HotelDashboard from "./Pages/HotelDashboard";
import HotelPendingOders from "./Pages/HotelPendingOders";
import ProtectedRoute from "./components/ProtectedRoute";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

const stripePromise = loadStripe("pk_test_51QRSxBRvJVs0SdRcL0lKwNDdb3gjvTqLyv4DcCe1LZYW7Ht0bjEXfeTU2E8ADjvaXQjTXBnTCbgsS2cr1HZHxUSG00wDU67XgO");

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          {/* Public Routes - No authentication needed */}
          <Route path="/hotelMenuCustomerPage" element={<HotelMenuCustomerPage />} />
          <Route path="/itemMenuPageCustomer" element={<ItemMenuPageCustomer />} />
          <Route path="/hotelMenuPageCustomer/:table_id" element={<HotelMenuCustomerPage />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/payment/:cartId" element={<Elements stripe={stripePromise}><PaymentPage /></Elements>} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/item-view/:dish_id" element={<ItemView />} />

          {/* Admin Login - Public (to allow admin to login) */}
          <Route path="/login" element={<Login />} />

          {/* Admin Protected Routes - Authentication required */}
          <Route path="/dashboard" element={<ProtectedRoute><HotelDashboard /></ProtectedRoute>} />
          <Route path="/add-new-item" element={<ProtectedRoute><NewItem /></ProtectedRoute>} />
          <Route path="/itemMenuPage" element={<ProtectedRoute><ItemMenuPage /></ProtectedRoute>} />
          <Route path="/hotelMenuPage" element={<ProtectedRoute><HotelMenuPage /></ProtectedRoute>} />
          <Route path="/pendingOrderPage" element={<ProtectedRoute><HotelPendingOders /></ProtectedRoute>} />
          <Route path="/add-new-menu" element={<ProtectedRoute><NewMenu /></ProtectedRoute>} />
          <Route path="/generate-qr" element={<ProtectedRoute><QRCodeGenerate /></ProtectedRoute>} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
