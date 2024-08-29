import React from "react";
import Searchbar from "../searchbar/Searchbar";
import sort from "../../../public/icons/misc/sort.svg";
import down from "../../../public/icons/misc/down.svg";
import exportIcon from "../../../public/icons/misc/export.svg";
import calender from "../../../public/icons/misc/calender.svg";
import filter from "../../../public/icons/misc/filter.svg";
import Image from "next/image";
import Dropdown from "../dropdown/DropdownIndex";
import DatePicker from "../datePicker/DatePicker";
import Button from "../button/Button";
import Pagination from "../pagination/Pagination";

export default function Table({
  headers,
  children,
  title,
  searchBar = false,
  searchPlaceHolder = "Type to Search",
  datePicker = false,
  exportToCSV = false,
}) {
  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="min-w-full flex flex-wrap justify-between items-center gap-x-10 gap-y-5 p-4 bg-primary-2 rounded-t-xl border border-primary-3 border-b-0">
        <div className="flex items-center flex-wrap gap-x-6 gap-y-4">
          <h3 className="text-heading-6 font-semibold text-primary-8">
            {title ? title : null}
          </h3>
          {searchBar ? <Searchbar placeHolder={searchPlaceHolder} /> : null}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {datePicker ? (
            <Dropdown>
              <Dropdown.Button>
                <Image src={calender} alt="Calender" />
              </Dropdown.Button>
              <Dropdown.Menu origin="top-left">
                <DatePicker />
              </Dropdown.Menu>
            </Dropdown>
          ) : null}

          <Dropdown>
            <Dropdown.Button>
              <Image src={filter} alt="Filter" />
              Filter
            </Dropdown.Button>
            <Dropdown.Menu origin="top-left">
              <Dropdown.Item>A-Z</Dropdown.Item>
              <Dropdown.Item>A-Z</Dropdown.Item>
              <Dropdown.Item>A-Z</Dropdown.Item>
              <Dropdown.Item>A-Z</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Button>
              <Image src={sort} alt="Sort" />
              Sort
            </Dropdown.Button>
            <Dropdown.Menu origin="top-left">
              <Dropdown.Item>A-Z</Dropdown.Item>
              <Dropdown.Item>A-Z</Dropdown.Item>
              <Dropdown.Item>A-Z</Dropdown.Item>
              <Dropdown.Item>A-Z</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {exportToCSV ? (
            <Button design="table">
              <Image src={exportIcon} alt="Export" />
              <p>Export to CSV</p>
            </Button>
          ) : null}
        </div>
      </div>

      {/* Table */}
      <div className="border-x border-primary-3 bg-white min-w-full overflow-x-auto overflow-y-visible">
        <table className="min-w-full border-collapse">
          <thead className="border-b-0.3 border-b-primary-8">
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

      {/* Footer */}
      <div className="table-bottom flex flex-wrap justify-between items-center gap-x-2 gap-y-5 p-4 bg-white border border-primary-3 border-t-0 rounded-b-xl min-w-full">
        <div className="flex items-center gap-2">
          <p className="text-body-2 text-black-7">Entries per page</p>
          <Dropdown>
            <Dropdown.Button>
              20
              <Image src={down} alt="Down" />
            </Dropdown.Button>
            <Dropdown.Menu origin="bottom-right">
              <Dropdown.Item>10</Dropdown.Item>
              <Dropdown.Item>20</Dropdown.Item>
              <Dropdown.Item>30</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Pagination currentPage={4} totalPages={10} onPageChange={() => {}} />
      </div>
    </div>
  );
}
