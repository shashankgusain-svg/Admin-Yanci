import cookies from "js-cookie";

const isProduction = process.env.NODE_ENV === "production";

const cookieFlags = {
  secure: isProduction,
  sameSite: "strict",
};

const getExpiryOptions = (expiry) => ({
  ...cookieFlags,
  expires: expiry ? 7 : 1 / 24,
});

export const setToken = (token, expiry) => {
  cookies.set("token", token, getExpiryOptions(expiry));
};

export const getAuthToken = async () => {
  const cookie = await cookies.get("token");

  if (!cookie) {
    return null;
  }
  return cookie;
};

export const removeToken = () => cookies.remove("token", cookieFlags);

export const setUser = (user, expiry) => {
  cookies.set("user", JSON.stringify(user), getExpiryOptions(expiry));
};

export const getUser = () => {
  const cookie = cookies.get("user");
  if (!cookie) {
    return null;
  }
  try {
    const user = JSON.parse(cookie);
    const isSuperAdmin = user.roleType === "SUPER";
    return { ...user, isSuperAdmin };
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const removeUser = () => cookies.remove("user", cookieFlags);
