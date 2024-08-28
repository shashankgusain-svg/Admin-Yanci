import DropdownContext from "@/contexts/dropdown/DropdownContext";
import { useContext } from "react";

export default function DropdownMenu({
  children,
  className,
  origin = "top-right",
}) {
  const { isOpen } = useContext(DropdownContext);

  const getOriginClasses = () => {
    switch (origin) {
      case "top-left":
        return "origin-top-left top-full left-0 pt-2";
      case "top-right":
        return "origin-top-right top-full right-0 pt-2";
      case "bottom-left":
        return "origin-bottom-left bottom-full left-0 pb-2";
      case "bottom-right":
        return "origin-bottom-right bottom-full right-0 pb-2";
      default:
        return "origin-top-right top-full right-0 pt-2";
    }
  };

  return (
    <div
      className={`
        dropdown-menu absolute ease-in-out transition-all duration-200
        ${isOpen ? "visible scale-100" : "invisible scale-0"}
        ${getOriginClasses()}
        ${className}
      `}
    >
      <div className="overflow-hidden bg-white flex flex-col modalShadow">
        {children}
      </div>
    </div>
  );
}
