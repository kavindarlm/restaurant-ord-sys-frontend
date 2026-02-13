import "./App.css";
import { BrowserRouter,Routes,Route } from "react-router-dom";
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

const stripePromise = loadStripe("pk_test_51QRSxBRvJVs0SdRcL0lKwNDdb3gjvTqLyv4DcCe1LZYW7Ht0bjEXfeTU2E8ADjvaXQjTXBnTCbgsS2cr1HZHxUSG00wDU67XgO");
function App() {
  return (
    <>
   
    <BrowserRouter>
    <Routes>
      
    <Route path="/dashboard" element={<ProtectedRoute><HotelDashboard /></ProtectedRoute>}></Route>
      <Route path="/hotelMenuCustomerPage" element={<HotelMenuCustomerPage/>}></Route>
      <Route path="/add-new-item" element={<ProtectedRoute><NewItem/></ProtectedRoute>}></Route>
      <Route path="/login" element = {<Login/>}></Route>
      <Route path="/itemMenuPage" element = {<ProtectedRoute><ItemMenuPage/></ProtectedRoute>}></Route>
      <Route path="/hotelMenuPage" element={<ProtectedRoute><HotelMenuPage/></ProtectedRoute>}></Route>
      <Route path="/itemMenuPageCustomer" element={<ItemMenuPageCustomer/>}></Route>
      <Route path="/hotelMenuPageCustomer/:table_id" element={<HotelMenuCustomerPage/>}></Route>
      <Route path="/pendingOrderPage" element={<ProtectedRoute><HotelPendingOders/></ProtectedRoute>}></Route>
      <Route path="/navbar" element={<Navbar/>}></Route>
      <Route path="/payment/:cartId" element={<Elements stripe={stripePromise}><PaymentPage /></Elements>}/>
      <Route path="/shopping" element={<ShoppingPage/>}></Route>
      <Route path="/item-view/:dish_id" element={<ItemView/>}></Route>
      <Route path="/add-new-menu" element={<ProtectedRoute><NewMenu/></ProtectedRoute>}></Route>
      <Route path="/generate-qr" element={<ProtectedRoute><QRCodeGenerate/></ProtectedRoute>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
