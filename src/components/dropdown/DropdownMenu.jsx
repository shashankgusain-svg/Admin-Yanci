import DropdownContext from "@/contexts/dropdown/DropdownContext";
import { useContext } from "react";

export default function DropdownMenu({
  children,
  origin = "top-right" | "top-left" | "bottom-left" | "bottom-right",
}) {
  const { isOpen } = useContext(DropdownContext);
  return (
    <div
      className={`
      dropdown-menu absolute ease-in-out transition-all duration-200
     ${
       origin === "bottom-left" || origin === "bottom-right"
         ? "pb-2"
         : origin === "top-left" || origin === "top-right"
         ? "pt-2"
         : "pt-2"
     }

      ${isOpen ? "visible scale-100" : "invisible scale-0"} 
      ${
        origin === "top-left"
          ? "origin-top-left top-full left-0"
          : origin === "top-right"
          ? "origin-top-right top-full right-0"
          : origin === "bottom-left"
          ? "origin-bottom-left bottom-full left-0"
          : origin === "bottom-right"
          ? "origin-bottom-right bottom-full right-0"
          : "origin-top-right top-full right-0"
      }
    `}
    >
      <div className="overflow-hidden bg-white flex flex-col modalShadow">
        {children}
      </div>
    </div>
  );
}
