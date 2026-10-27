const API_URL = "http://localhost:5000/api";

// GET: Fetch all alerts
export const getAlerts = async () => {
  const response = await fetch(`${API_URL}/alerts`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch alerts");
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
    throw new Error(result.message || "Failed to create alert");
  }

  return result.data;
};

export const updateAlert = async (id, alertData) => {
  if (!id) {
    throw new Error("Alert ID is required");
  }

  const response = await fetch(
    `${API_URL}/alerts/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(alertData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update alert"
    );
  }

  return result.data;
};


 // GET: Fetch overall activity totals
export const getActivitySummary = async () => {
  const response = await fetch(
    `${API_URL}/alerts/activity/summary`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch activity summary"
    );
  }

  return result.data;
};

// GET: Fetch the latest activity records
export const getRecentActivity = async () => {
  const response = await fetch(
    `${API_URL}/alerts/activity/recent`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch recent activity"
    );
  }

  return result.data;
};

// GET: Fetch activity history for a specific alert
export const getAlertActivity = async (alertId) => {
  if (!alertId) {
    throw new Error("Alert ID is required");
  }

  const response = await fetch(
    `${API_URL}/alerts/${encodeURIComponent(alertId)}/activity`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch alert activity"
    );
  }

  return result;
};

// DELETE: Permanently delete an alert
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
    throw new Error(result.message || "Failed to delete alert");
  }

  return result;
};


