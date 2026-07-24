const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
/* 
The primary difference between import.meta.env and process.env 
lies in their environment runtime and specification standard: 
import.meta.env is a modern, JavaScript-standard approach used by frontend build tools (like Vite), 
whereas process.env is a Node.js-specific global object traditionally used for server-side environments 
*/

export async function fetchAudit(url) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch {
    // fetch() itself throws only on network failure (offline, DNS, CORS block)
    throw new Error("Could not reach the server. Check your connection.");
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload?.error?.message || `Request failed (${response.status}).`,
    );
  }

  return payload.data;
}

/* separating "the network layer" from "the UI layer" so that if we ever need to swap `fetch` for `axios`, only this one file changes. */
