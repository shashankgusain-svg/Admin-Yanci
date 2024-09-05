import React from "react";
import Dropdown from "../dropdown/DropdownIndex";

export default function TableRow({
  children,
  isDropdown = false,
  dropdownItems,
}) {
  return (
    <tr className="border-b-0.3 border-primary-8 hover:bg-primary-1">
      {children}
      {isDropdown ? (
        <td>
          <Dropdown>
            <Dropdown.Button type="clean" className="table-cell px-1">
              <span className="font-bold">&#8942;</span>
            </Dropdown.Button>
            <Dropdown.Menu origin="bottom-right">
              {dropdownItems.map((dropdownItem, index) => (
                <Dropdown.Item
                  onClick={dropdownItem.onClick}
                >
                  <Image src={dropdownItem.icon} alt="View Details" />
                  <p>{dropdownItem.text}</p>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </td>
      ) : null}
    </tr>
  );
}
