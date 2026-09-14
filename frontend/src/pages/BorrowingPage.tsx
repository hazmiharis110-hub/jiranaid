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

  // Inside BorrowingPage.tsx
  const loadRequests = async () => {
    try {
      const response = await borrowService.getBookings();

      const rawList = Array.isArray(response)
        ? response
        : response?.data || response?.bookings || [];

      const formattedRequests = rawList.map((booking: any) => ({
        ...booking,
        id: String(booking.id),
        _id: String(booking.id),

        toolId: String(booking.item_id || booking.tool_id),
        toolTitle: booking.tool_title || "Unknown Item",
        toolImage: booking.tool_image || "",
        toolCategory: booking.tool_category || "General",

        // Correctly handle ownerId and borrowerId from SQL aliases
        ownerId: String(booking.owner_id),
        ownerName: booking.owner_name || "Unknown Owner",

        borrowerId: String(booking.borrower_id ?? booking.user_id),
        borrowerName: booking.borrower_name || "Unknown Borrower",

        startDate: booking.start_date,
        endDate: booking.end_date,
        status: String(booking.status || "pending").toLowerCase(),

        daysCount: Math.max(
          1,
          Math.ceil(
            (new Date(booking.end_date).getTime() -
              new Date(booking.start_date).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        ),

        maintenanceFee: Number(booking.maintenance_fee || 0),
        depositFee: Number(booking.deposit_fee || 0),
        totalPaid: Number(booking.total_price || 0),
        depositRefunded: booking.status === "returned",
      }));

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
      console.log(`Executing action "${action}" on request ID:`, requestId);

      switch (action) {
        case "approve":
          await borrowService.approveBooking(requestId);
          break;
        case "decline":
        case "reject":
          await borrowService.declineBooking(requestId);
          break;
        case "cancel":
          await borrowService.cancelBooking(requestId);
          break;
        default:
          // Fallback check based on status param
          if (status === "approved") {
            await borrowService.approveBooking(requestId);
          } else if (status === "declined" || status === "rejected") {
            await borrowService.declineBooking(requestId);
          } else if (status === "cancelled") {
            await borrowService.cancelBooking(requestId);
          }
          break;
      }

      // Re-fetch list and sync tool store
      await loadRequests();
      if (typeof fetchTools === "function") {
        fetchTools();
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  // Standardize currentUser object to guarantee ID is a string before passing to view
  const formattedCurrentUser = currentUser
    ? { ...currentUser, id: String(currentUser.id) }
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BorrowRequestsView
        requests={requests}
        currentUser={formattedCurrentUser}
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
