import React from "react";
import Image from "next/image";
import NotificationRound from "../../../public/icons/navbar/notification-round.svg";
import Logo from "../../../public/images/yanci-full-logo.svg";
import add from "../../../public/icons/misc/add.svg";
import DummyImg from "../../../public/images/dummyImage.png";
import Link from "next/link";
import Button from "../button/Button";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="navbar border-b-2 border-black-3 w-full bg-white fixed top-0 left-0 py-4 px-8 z-10">
      <div className="flex justify-between items-center">
        <Image src={Logo} alt="Logo"/>
        <div className="flex items-center gap-6 ">
          {pathname === "/notifications" ? (
            <Button className="font-normal" onClick={()=>{router.push("notifications/create")}}>
              <Image src={add} alt="Create new"/>
              Create Notification
            </Button>
          ) : null}
          <button>
            <Image src={NotificationRound} alt="Notifications" />
          </button>
          <Link
            href="/"
            className="profilePicture overflow-hidden rounded-full w-10 h-10 bg-cover bg-center"
          >
            <Image className="object-cover" src={DummyImg} alt="Profile Image"/>
          </Link>
        </div>
      </div>
    </nav>
  );
}
