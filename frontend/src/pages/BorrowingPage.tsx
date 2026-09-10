import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { BorrowRequestsView } from "../components/BorrowRequestsView";
import { useAuthStore } from "../store/useAuthStore";
import { useItemStore } from "../store/useItemStore";
import { borrowService } from "../services/borrowService";
import type { BorrowRequest } from "../types";

export const BorrowingPage: React.FC = () => {
  console.log("BorrowingPage loaded");
  const navigate = useNavigate();
  const outletContext = useOutletContext<any>();

  const { currentUser } = useAuthStore();
  const { fetchTools } = useItemStore();

  const [requests, setRequests] = useState<BorrowRequest[]>([]);

  const loadRequests = async () => {
    console.log("Loadrequests started");
  try {
    const response = await borrowService.getBookings();

    console.log("Bookings from backend:", response);

    const formattedRequests = ((response as any) || []).map((booking: any) => ({
      ...booking,

      toolId: booking.item_id,
      toolTitle: booking.tool_title,
      toolImage: booking.tool_image,
      toolCategory: booking.tool_category,

      ownerId: booking.owner_id,
      ownerName: booking.owner_name,

      borrowerId: booking.user_id,
      borrowerName: booking.borrower_name,

      startDate: booking.start_date,
      endDate: booking.end_date,

      daysCount: Math.max(
        1,
        Math.ceil(
          (new Date(booking.end_date).getTime() -
            new Date(booking.start_date).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      ),

      maintenanceFee: Number(booking.maintenance_fee),
      depositFee: Number(booking.deposit_fee),
      totalPaid: Number(booking.total_price),

      depositRefunded: booking.status === "returned",
    }));

    console.log("Formatted bookings:", formattedRequests);

    setRequests(formattedRequests);
  } catch (error) {
    console.error("Failed to load bookings:", error);
    setRequests([]);
  }
};

  useEffect(() => {
    console.log("useEffect is running");
    loadRequests();
  }, [currentUser]);

  const handleUpdateStatus = async (
    requestId: string | number,
    status: string,
    action: string,
  ) => {
    try {
      if (action === "cancel") {
        await borrowService.cancelBooking(requestId);
        await loadRequests();
        fetchTools();
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BorrowRequestsView
        requests={requests}
        currentUser={currentUser}
        onUpdateStatus={handleUpdateStatus}
        onOpenReviewModal={(req) => {
          if (outletContext?.onOpenReview) {
            outletContext.onOpenReview(req);
          }
        }}
        onSwitchToCatalog={() => navigate("/items")}
        onSwitchToLenderDashboard={() => navigate("/dashboard")}
        onOpenAuthModal={() => {
          if (outletContext?.onOpenAuth) {
            outletContext.onOpenAuth("login");
          } else {
            navigate("/login");
          }
        }}
      />
    </div>
  );
};

export default BorrowingPage;