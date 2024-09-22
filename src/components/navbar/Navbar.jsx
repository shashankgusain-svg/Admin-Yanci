import React from "react";
import Image from "next/image";
import NotificationRound from "../../../public/icons/navbar/notification-round.svg";
import add from "../../../public/icons/misc/add.svg";
import DummyImg from "../../../public/images/dummyImage.png";
import Link from "next/link";
import Button from "../button/Button";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import Logo from "../../../public/icons/misc/Logo";
import { canEdit } from "@/utils/helpers";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="navbar flex border-b-2 border-black-3 w-full bg-white sticky top-0 left-0 px-8 z-30">
      <div className="min-w-full flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-6 ">
          {pathname === "/notifications" && canEdit("Notifications") ? (
            <Button
              className="font-normal h-11"
              onClick={() => {
                router.push("notifications/create");
              }}
            >
              <Image src={add} alt="Create new" />
              Create Notification
            </Button>
          ) : null}
          {pathname === "/role-management" && canEdit("Role Management") ? (
            <Button
              className="font-normal h-11"
              onClick={() => {
                router.push("role-management/add-admin");
              }}
            >
              <Image src={add} alt="Add new" />
              Add Sub Admin
            </Button>
          ) : null}
          {pathname === "/support" && canEdit("User Support") ? (
            <Button
              className="font-normal h-11"
              onClick={() => {
                router.push("support/create-faq");
              }}
            >
              <Image src={add} alt="Add new" />
              Create FAQ
            </Button>
          ) : null}
          <button>
            <Image src={NotificationRound} alt="Notifications" />
          </button>
          <Link
            href="/"
            className="profilePicture overflow-hidden rounded-full w-10 h-10 bg-cover bg-center"
          >
            <Image
              className="object-cover"
              src={DummyImg}
              alt="Profile Image"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
