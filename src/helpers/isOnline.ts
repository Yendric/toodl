export async function isOnline() {
  if (!window.navigator.onLine) return false;

  const response = await fetch(window.location.origin, { method: "HEAD" });

  return response.ok;
}
