import api from "./api";

export const reviewService = {
  async createReview(payload: {
    booking_id: number;
    rating: number;
    comment: string;
  }) {
    return await api.post("/reviews", payload);
  },

  async getReviews() {
    return await api.get("/reviews");
  }
};

export default reviewService;