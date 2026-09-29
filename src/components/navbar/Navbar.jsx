import React, { useEffect, useState } from "react";
import Image from "next/image";
import NotificationRound from "../../../public/icons/navbar/notification-round.svg";
import add from "../../../public/icons/misc/add.svg";
import Link from "next/link";
import Button from "../button/Button";
import { useRouter } from "next/router";
import { canEdit } from "@/utils/helpers";
import TradingFeeModal from "../modals/TradingFeeModal";
import { getUser } from "@/services/api/cookies";

export default function Navbar() {
  const router = useRouter();
  const pathname = router.pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setMounted(true);
  }, []);

  const displayName =
    user?.name || user?.fullName || user?.email || "Admin";
  const roleLabel = user?.isSuperAdmin
    ? "Super Admin"
    : user?.roleType || user?.role || "Administrator";
  const initials = String(displayName)
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    // Deep-link into built module list searches where possible
    if (pathname?.startsWith("/user")) {
      router.push(`/user?search=${encodeURIComponent(q)}`);
    } else if (pathname?.startsWith("/kyc")) {
      router.push(`/kyc?search=${encodeURIComponent(q)}`);
    } else {
      router.push(`/user?search=${encodeURIComponent(q)}`);
    }
  };

  const showAction = (path, permission) =>
    mounted && pathname === path && canEdit(permission);

  return (
    <nav className="navbar flex border-b border-black-5 w-full bg-white sticky top-0 left-0 px-6 z-30">
      <div className="min-w-full flex justify-between items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users, KYC, email, phone…"
            className="w-full h-10 px-3 rounded-input border border-black-5 bg-canvas text-body-2 text-navy placeholder:text-status-neutral focus:outline-none focus:outline-2 focus:outline-primary-6"
          />
        </form>

        <div className="flex items-center gap-4 shrink-0">
          {showAction("/notifications", "Notifications") ? (
            <Button
              className="font-normal h-10"
              design="primary"
              onClick={() => router.push("notifications/create")}
            >
              <Image src={add} alt="" />
              Create notification
            </Button>
          ) : null}
          {showAction("/role-management", "Role Management") ? (
            <Button
              className="font-normal h-10"
              design="primary"
              onClick={() => router.push("role-management/add-admin")}
            >
              <Image src={add} alt="" />
              Add sub admin
            </Button>
          ) : null}
          {showAction("/revenue", "Revenue") ? (
            <Button
              className="font-normal h-10"
              design="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Edit trading fee
            </Button>
          ) : null}
          {isModalOpen ? (
            <TradingFeeModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          ) : null}
          {showAction("/support", "User Support") ? (
            <Button
              className="font-normal h-10"
              design="primary"
              onClick={() => router.push("support/create-faq")}
            >
              <Image src={add} alt="" />
              Create FAQ
            </Button>
          ) : null}

          <Link
            href="/notifications"
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-canvas"
            title="Notifications"
          >
            <Image src={NotificationRound} alt="Notifications" />
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-black-5">
            <div className="w-9 h-9 rounded-full bg-primary-1 text-primary-7 text-label-2 font-semibold flex items-center justify-center">
              {initials}
            </div>
            <div className="hidden sm:block min-w-0 max-w-[160px]">
              <p className="text-body-2 font-semibold text-navy truncate">
                {displayName}
              </p>
              <p className="text-label-2 text-black-7 truncate">{roleLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
