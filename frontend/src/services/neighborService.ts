import api from "./api";

// inside services/neighborService.ts
export const neighborService = {
  getNeighbors: async () => {
    // Add cache-busting headers or a timestamp parameter
    const response = await api.get("/neighborhoods", {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
      // Alternatively, append a dynamic query param to force a fresh GET:
      params: { _t: Date.now() },
    });
    console.log(response);
    return response;
  },
};
