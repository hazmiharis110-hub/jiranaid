// frontend/src/services/borrowService.ts
import { api } from "./api";

export const borrowService = {
  async getBookings() {
    const res = await api.get("/bookings");
    console.log("Raw API method output:", res);

    // If your interceptor unwraps response.data, 'res' is already the array!
    return res?.data !== undefined ? res.data : res;
  },

  async approveBooking(id: string | number) {
    const res = await api.put(`/bookings/${id}/approve`);
    return res?.data !== undefined ? res.data : res;
  },

  async declineBooking(id: string | number) {
    const res = await api.put(`/bookings/${id}/decline`);
    return res?.data !== undefined ? res.data : res;
  },

  async cancelBooking(id: string | number) {
    const res = await api.put(`/bookings/${id}/cancel`);
    return res?.data !== undefined ? res.data : res;
  },
};
