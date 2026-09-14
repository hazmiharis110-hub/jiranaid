import api from "./api";

export const neighborService = {
  getNeighbors: async () => {
    const response: any = await api.get("/neighborhoods");

    console.log("NEIGHBORHOODS RESPONSE:", response);

    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.neighborhoods)) {
      return response.neighborhoods;
    }

    return [];
  },
};