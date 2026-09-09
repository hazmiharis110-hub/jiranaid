import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { BorrowRequestsView } from '../components/BorrowRequestsView';
import { useAuthStore } from '../store/useAuthStore';
import { useItemStore } from '../store/useItemStore';
import type { BorrowRequest } from '../types';

export const BorrowingPage: React.FC = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext<any>();
  const { currentUser } = useAuthStore();
  const { fetchTools } = useItemStore();

  const [requests, setRequests] = useState<BorrowRequest[]>([]);

  const loadRequests = () => {
    fetch('/api/borrow-requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.requests) {
          setRequests(data.requests);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadRequests();
  }, [currentUser]);

  const handleUpdateStatus = async (
    requestId: string | number,
    status: string,
    action: string
  ) => {
    try {
      await fetch(`/api/borrow-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, action }),
      });
      loadRequests();
      fetchTools();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BorrowRequestsView
        requests={requests}
        currentUser={currentUser}
        onUpdateStatus={handleUpdateStatus}
        onOpenReviewModal={(req) => {
          if (outletContext?.onOpenReview) outletContext.onOpenReview(req);
        }}
        onSwitchToCatalog={() => navigate('/items')}
        onSwitchToLenderDashboard={() => navigate('/dashboard')}
        onOpenAuthModal={() => {
          if (outletContext?.onOpenAuth) outletContext.onOpenAuth('login');
          else navigate('/login');
        }}
      />
    </div>
  );
};

export default BorrowingPage;
