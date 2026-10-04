const API_BASE_URL = "http://localhost:5000/api";

export async function getAlerts() {
  const response = await fetch(`${API_BASE_URL}/alerts`);

  if (!response.ok) {
    throw new Error("Failed to fetch alert procedures");
  }

  const result = await response.json();

  return result.data;
}