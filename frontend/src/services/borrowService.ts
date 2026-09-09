// src/services/borrowService.ts
import api from "./api";

export const borrowService = {
  async getBorrowRequests() {
    return await api.get("/borrow-requests");
  },

  async createBorrowRequest(payload: {
    itemId: string;
    startDate: string;
    endDate: string;
  }) {
    return await api.post("/borrow-requests", payload);
  },

  async updateRequestStatus(
    requestId: string,
    status: "approved" | "rejected" | "returned",
  ) {
    return await api.patch(`/borrow-requests/${requestId}/status`, { status });
  },
};

export default borrowService;
