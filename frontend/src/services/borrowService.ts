import api from "./api";

export const borrowService = {
  async getBookings() {
    return await api.get("/bookings");
  },

  async getBookingById(id: number | string) {
    return await api.get(`/bookings/${id}`);
  },

  async cancelBooking(id: number | string) {
    return await api.patch(`/bookings/${id}/cancel`);
  },
};

export default borrowService;