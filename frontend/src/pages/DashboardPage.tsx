// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { LenderDashboard } from "../components/LenderDashboard";
import { useAuthStore } from "../store/useAuthStore";
import { useItemStore } from "../store/useItemStore";
import itemService from "../services/itemService";
import type { BorrowRequest, ToolItem } from "../types";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext<any>();
  const { currentUser } = useAuthStore();
  const { tools, fetchTools } = useItemStore();

  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);

  const loadRequests = async () => {
    try {
      const data = await itemService.getBorrowRequests();
      if (data && data.requests) {
        setBorrowRequests(data.requests);
      }
    } catch (err) {
      console.error(err);
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
    try {
      await itemService.updateBorrowRequestStatus(requestId, status, action);
      await loadRequests();
      await fetchTools();
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
        onOpenAddModal={() => navigate("/items/create")}
        onUpdateStatus={handleUpdateStatus}
        onToolUpdated={() => fetchTools()}
        onSelectToolDetail={(tool: ToolItem) => navigate(`/items/${tool.id}`)}
        onOpenAuthModal={() => {
          if (outletContext?.onOpenAuth) outletContext.onOpenAuth("login");
          else navigate("/login");
        }}
      />
    </div>
  );
};

export default DashboardPage;
