import React from "react";
import Searchbar from "../searchbar/Searchbar";
import sort from "../../../public/icons/misc/sort.svg";
import filter from "../../../public/icons/misc/filter.svg";
import Image from "next/image";
import Dropdown from "../dropdown";

export default function Table({
  headers,
  children,
  title,
  searchBar = false,
  searchPlaceHolder,
  datePicker,
  exportToCSV,
}) {
  return (
    <div className="flex flex-col">
      <div className="table-title h-14 flex justify-between items-center rounded-t-xl border border-primary-3 border-b-0 bg-primary-2">
        <div className="flex items-center gap-6">
          <h3 className="text-heading-6 font-semibold text-primary-8">
            {title}
          </h3>
          {searchBar ? <Searchbar placeHolder={searchPlaceHolder ? searchPlaceHolder : "Type to Search"} /> : null}
        </div>
        <div className="flex items-center gap-3">
          <Dropdown>
            <Dropdown.Button>
              <Image src={filter} />
              Filter
            </Dropdown.Button>
            <Dropdown.Menu origin="right">
              <Dropdown.Item>A-Z</Dropdown.Item>
              <Dropdown.Item>A-Z</Dropdown.Item>
              <Dropdown.Item>A-Z</Dropdown.Item>
              <Dropdown.Item>A-Z</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Button>
              <Image src={sort} />
              Sort
            </Dropdown.Button>
            <Dropdown.Menu origin="right">
              <Dropdown.Item>A-Z</Dropdown.Item>
              <Dropdown.Item>A-Z</Dropdown.Item>
              <Dropdown.Item>A-Z</Dropdown.Item>
              <Dropdown.Item>A-Z</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="overflow-x-auto border-x border-primary-3 bg-white">
        <table className="min-w-full border-collapse">
          <thead className="">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="table-header text-left text-primary-8 text-body-1 font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">{children}</tbody>
        </table>
      </div>
      <div className="table-bottom bg-white border border-primary-3 border-t-0 rounded-b-xl">
        
      </div>
    </div>
  );
}
