import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { LenderDashboard } from '../components/LenderDashboard';
import { useAuthStore } from '../store/useAuthStore';
import { useItemStore } from '../store/useItemStore';
import { borrowService } from '../services/borrowService';
import type { BorrowRequest, ToolItem } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext<any>();
  const { currentUser } = useAuthStore();
  const { tools, fetchTools } = useItemStore();

  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);

  const loadRequests = async () => {
    try {
      const data = await borrowService.getBookings();

      console.log("BOOKINGS RAW RESPONSE:", data);

      const rawList = Array.isArray(data)
        ? data
        : data?.data || data?.bookings || [];

      const formattedRequests = rawList.map((booking: any) => ({
        ...booking,
        id: String(booking.id),
        _id: String(booking.id),

        toolId: String(booking.item_id || booking.tool_id),
        toolTitle: booking.tool_title || 'Unknown Item',
        toolImage: booking.tool_image || '',
        toolCategory: booking.tool_category || 'General',

        ownerId: String(booking.owner_id),
        ownerName: booking.owner_name || 'Unknown Owner',

        borrowerId: String(booking.borrower_id ?? booking.user_id),
        borrowerName: booking.borrower_name || 'Unknown Borrower',

        startDate: booking.start_date,
        endDate: booking.end_date,
        status: String(booking.status || 'pending').toLowerCase(),

        daysCount: Math.max(
          1,
          Math.ceil(
            (new Date(booking.end_date).getTime() -
              new Date(booking.start_date).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        ),

        maintenanceFee: Number(booking.maintenance_fee || 0),
        depositFee: Number(booking.deposit_fee || 0),
        totalPaid: Number(booking.total_price || 0),
        depositRefunded: booking.status === 'returned',
      }));

      setBorrowRequests(formattedRequests);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = async (
    requestId: string | number,
    status: string,
    action?: string,
  ) => {
    console.log("UPDATE STATUS:", { requestId, status, action });
  try {
    if (status === 'approved') {
      await borrowService.approveBooking(requestId);
    } else if (status === 'declined') {
      await borrowService.declineBooking(requestId);
    } else if (status === 'cancelled') {
      await borrowService.cancelBooking(requestId);
    } else if (status === 'active') {
      await borrowService.activateBooking(requestId);
    } else if (status === 'returned') {
      await borrowService.returnBooking(requestId);
    }

    await loadRequests();
    fetchTools();
  } catch (err) {
    console.error('Failed to update booking status:', err);
  }
};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <LenderDashboard
        currentUser={currentUser}
        tools={tools}
        borrowRequests={borrowRequests}
        onOpenAddModal={() => navigate("/items/create")}
        onUpdateStatus={handleUpdateStatus}
        onToolUpdated={() => fetchTools()}
        onSelectToolDetail={(tool: ToolItem) =>
          navigate(`/items/${tool.id}`)
        }
        onOpenAuthModal={() => {
          if (outletContext?.onOpenAuth) {
            outletContext.onOpenAuth('login');
          } else {
            navigate('/login');
          }
        }}
      />
    </div>
  );
};

export default DashboardPage;