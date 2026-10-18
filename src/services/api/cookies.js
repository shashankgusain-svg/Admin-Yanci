import cookies from "js-cookie";

const cookieFlags = {
  path: "/",
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
};

function decodeBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return decodeURIComponent(
    Array.from(atob(padded + pad))
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );
}

export async function clearSession() {
  if (typeof window !== "undefined") {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // The readable cookie is still removed below.
    }
  }
  cookies.remove("token", cookieFlags);
  cookies.remove("user", cookieFlags);
}

export const removeToken = () => cookies.remove("token", cookieFlags);
export const removeUser = () => cookies.remove("user", cookieFlags);

export const getAuthToken = async () => null;

export const getUser = () => {
  const cookie = cookies.get("user");
  if (!cookie || !cookie.includes(".")) return null;

  try {
    const payload = cookie.slice(0, cookie.lastIndexOf("."));
    const user = JSON.parse(decodeBase64Url(payload));
    if (!user || typeof user !== "object") return null;
    return { ...user, isSuperAdmin: user.roleType === "SUPER" };
  } catch {
    return null;
  }
};
