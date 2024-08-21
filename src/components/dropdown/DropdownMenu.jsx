import DropdownContext from "@/contexts/dropdown/DropdownContext";
import { useContext } from "react";

export default function DropdownMenu({ children, origin }) {
  const { isOpen } = useContext(DropdownContext);
  return (
    <div className={`dropdown-menu absolute top-full pt-2 ease-in-out transition-all duration-200 ${isOpen ? "visible scale-100" : "invisible scale-0"} ${origin === "left" ? "origin-top-left left-0" : "origin-top-right right-0"}`}>
      <div className="overflow-hidden bg-white flex flex-col modalShadow">{children}</div>
    </div>
  );
}
