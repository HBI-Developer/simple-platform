export default async function isDirectMediaLink(url: string) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      mode: "cors",
    });

    if (!response.ok) {
      return false;
    }

    const contentType = response.headers.get("Content-Type");

    if (!contentType) {
      return false;
    }

    if (
      contentType.includes("text/html") ||
      contentType.includes("application/json")
    ) {
      return false;
    }

    if (contentType.includes("video/") || contentType.includes("audio/")) {
      return true;
    }

    return false;
  } catch (_) {
    return url.slice(url.lastIndexOf(".") + 1).length <= 5;
  }
}
