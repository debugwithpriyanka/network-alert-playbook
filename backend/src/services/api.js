
const API_URL = "http://localhost:5000/api";

// GET: Fetch all active alerts
export const getAlerts = async () => {
  const response = await fetch(`${API_URL}/alerts`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch alerts"
    );
  }

  return result.data;
};

// POST: Create a new alert
export const createAlert = async (alertData) => {
  const response = await fetch(`${API_URL}/alerts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(alertData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create alert"
    );
  }

  return result.data;
};


export const deleteAlert = async (id) => {
  if (!id) {
    throw new Error("Alert ID is required");
  }

  const response = await fetch(
    `${API_URL}/alerts/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete alert"
    );
  }

  return result;
};