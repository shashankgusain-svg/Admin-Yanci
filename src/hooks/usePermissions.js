import React from "react";
import { canEdit } from "@/utils/helpers";
import { getUser } from "@/services/api/cookies";

/**
 * Permissions live in a browser cookie, so they're read after mount; reading
 * them during render makes the server and client HTML differ (hydration error).
 */
export function useCanEdit(permissionName) {
  const [allowed, setAllowed] = React.useState(false);
  React.useEffect(() => {
    setAllowed(canEdit(permissionName));
  }, [permissionName]);
  return allowed;
}

export function useIsSuperAdmin() {
  const [isSuper, setIsSuper] = React.useState(false);
  React.useEffect(() => {
    const user = getUser();
    setIsSuper(Boolean(user?.isSuperAdmin || user?.roleType === "SUPER"));
  }, []);
  return isSuper;
}
