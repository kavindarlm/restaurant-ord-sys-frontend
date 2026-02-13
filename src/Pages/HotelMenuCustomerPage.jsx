import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HotelMenuCustomer from "../components/Customer/HotelMenuCustomer";
import Footer from "../components/footer";
import Navbar2 from "../components/navbar2";
import axios from "axios";

function HotelMenuCustomerPage() {
  const { table_id } = useParams(); // This is now an encrypted table ID
  const [tableInfo, setTableInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTableInfo = async () => {
      if (table_id) {
        try {
          // Store encrypted table_id in sessionStorage for security
          sessionStorage.setItem('encrypted_table_id', table_id);
          
          // Optionally fetch table info to validate the encrypted ID
          const response = await axios.get(`http://localhost:4000/table/secure/${table_id}`);
          setTableInfo(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching table information:", err);
          setError("Invalid or expired table QR code. Please scan again.");
          setLoading(false);
        }
      } else {
        setError("No table ID provided");
        setLoading(false);
      }
    };

    fetchTableInfo();
  }, [table_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
          <p className="text-orange-900">Loading table information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 relative flex flex-col">
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundImage: 'url(https://img.freepik.com/free-photo/top-view-circular-food-frame_23-2148723455.jpg?t=st=1734521074~exp=1734524674~hmac=7b00696977e1fa6c8169ef3c5887450344265f9875995ffb44368c528f9e7520&w=1060)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2 }}
      ></div>
       {/* Navbar */}
       <div className="sticky top-0 z-20 bg-orange-50">
        <Navbar2 />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto py-14  sm:px-8 lg:px-16">
        <HotelMenuCustomer />
      </div>
      
      {/* Footer */}
      <div className="sticky bottom-0 z-20 bg-orange-50">
        <Footer />
      </div>
    </div>
  );
}

export default HotelMenuCustomerPage;
