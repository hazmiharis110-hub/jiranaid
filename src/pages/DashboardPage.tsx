import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { LenderDashboard } from '../components/LenderDashboard';
import { useAuthStore } from '../store/useAuthStore';
import { useItemStore } from '../store/useItemStore';
import type { BorrowRequest, ToolItem } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext<any>();
  const { currentUser } = useAuthStore();
  const { tools, fetchTools } = useItemStore();

  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);

  const loadRequests = () => {
    fetch('/api/borrow-requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.requests) {
          setBorrowRequests(data.requests);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = async (
    requestId: string,
    status: string,
    action?: string
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
      <LenderDashboard
        currentUser={currentUser}
        tools={tools}
        borrowRequests={borrowRequests}
        onOpenAddModal={() => navigate('/items/create')}
        onUpdateStatus={handleUpdateStatus}
        onToolUpdated={() => fetchTools()}
        onSelectToolDetail={(tool: ToolItem) => navigate(`/items/${tool.id}`)}
        onOpenAuthModal={() => {
          if (outletContext?.onOpenAuth) outletContext.onOpenAuth('login');
          else navigate('/login');
        }}
      />
    </div>
  );
};

export default DashboardPage;
