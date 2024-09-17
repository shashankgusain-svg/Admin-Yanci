import cookies from "js-cookie";

export const setToken = (token, expiry) => {
  cookies.set("token", token, {
    expires: expiry ? 7 : 1 / 24,
  });
};

export const getAuthToken = async () => {
  const cookie = await cookies.get("token");

  if (!cookie) {
    return null;
  }
  return cookie;
};

export const removeToken = () => cookies.remove("token");

export const setUser = (user, expiry) => {
  cookies.set("user", JSON.stringify(user), {
    expires: expiry ? 7 : 1 / 24,
  });
};

export const getUser = () => {
  const cookie = cookies.get("user");
  if (!cookie) {
    return null;
  }
  try {
    const user = JSON.parse(cookie);
    const isSuperAdmin =
      !user.adminPermission || user.adminPermission.length === 0;
    return { ...user, isSuperAdmin };
  } catch (e) {
    console.log(e);
  }
};

export const removeUser = () => cookies.remove("user");
