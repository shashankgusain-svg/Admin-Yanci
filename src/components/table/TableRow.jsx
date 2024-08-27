import React from "react";
import Dropdown from "../dropdown";
import Image from "next/image";

export default function TableRow({ children, dropdownItems = [] }) {
  return (
    <tr className="border-b-0.3 border-primary-8 cursor-pointer">
      {children}
      <td>
        <Dropdown>
          <Dropdown.Button type="clean" className="table-cell px-1">
            <span className="font-bold">&#8942;</span>
          </Dropdown.Button>
          <Dropdown.Menu origin="bottom-right">
            {dropdownItems.map((item, index) => (
              <Dropdown.Item
                key={index}
                className={item.className}
                onClick={item.onClick}
              >
                {item.icon && <Image src={item.icon} />}
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
}
