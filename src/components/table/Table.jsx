import React, { useState } from "react";
import Searchbar from "../searchbar/Searchbar";
import down from "../../../public/icons/misc/down.svg";
import exportIcon from "../../../public/icons/misc/export.svg";
import calender from "../../../public/icons/misc/calender.svg";
import filterIcon from "../../../public/icons/misc/filter.svg";
import Image from "next/image";
import Dropdown from "../dropdown/DropdownIndex";
import Button from "../button/Button";
import Pagination from "../pagination/Pagination";
import LoadingAnimation from "../../../public/icons/animated/loading";
import SortIcon from "../../../public/icons/misc/SortIcon";
import { downloadCSV } from "@/utils/helpers";
import CustomDatePicker from "../datePicker/DatePicker";

export default function Table({
  columns = [],
  title,
  searchBar = false,
  searchPlaceHolder = "Type to Search",
  onSearch,
  searchValue,
  filter = false,
  onFilter,
  datePicker = false,
  exportToCSV = false,
  isDropdown = false,
  dropdownItems = [],
  data = [],
  isLoading = true,
  paginationProps,
  limitProps,
  dateValue,
  dateOnChange = () => { },
}) {
  console.log(paginationProps);
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleFilter = (status) => {
    setSelectedStatus(status); // Update the selected status
    onFilter(status); // Call the filter function with the selected status
  };
  return (
    <div className="w-full flex flex-col relative slideAndAppear">
      {/* Header */}
      <div className="min-w-full flex flex-wrap justify-between items-center gap-x-10 gap-y-5 p-4 bg-primary-2 rounded-t-xl border border-primary-3 border-b-0">
        <div className="flex items-center flex-wrap gap-y-4">
          <h3 className="text-heading-6 font-semibold text-primary-8">
            {title ? title : null}
          </h3>
          {searchBar ? (
            <Searchbar
              value={searchValue}
              onChange={onSearch}
              placeHolder={searchPlaceHolder}
            />
          ) : null}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {datePicker ? (
            <Dropdown>
              <Dropdown.Button title="Date Picker">
                <Image src={calender} alt="Calender" />
              </Dropdown.Button>
              <Dropdown.Menu origin="top-right">
                <CustomDatePicker values={dateValue} onChange={dateOnChange} />
              </Dropdown.Menu>
            </Dropdown>
          ) : null}

          {filter ? (
            <Dropdown>
              <Dropdown.Button title="Filter">
                <Image src={filterIcon} alt="filterIcon" />
                <p>Filters</p>
              </Dropdown.Button>
              <Dropdown.Menu origin="top-right-2">
                {["Pending", "Success", "Failed"].map((status) => (
                  <Dropdown.Item
                    key={status}
                    onClick={() => handleFilter(status.toLowerCase())}
                    className={selectedStatus === status.toLowerCase() ? "bg-gray-200 font-semibold" : ""}
                  >
                    {status}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ) : null}

          {exportToCSV ? (
            <Button
              design="table"
              onClick={() => {
                downloadCSV(columns, data);
              }}
              title="Export to CSV"
            >
              <Image src={exportIcon} alt="Export" />
              <p>Export to CSV</p>
            </Button>
          ) : null}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper border-x border-primary-3 bg-white min-w-full overflow-x-auto">
        {isLoading ? (
          <div className="min-w-full table-header min-h-20">
            <LoadingAnimation />
          </div>
        ) : (
          <table className="min-w-full border-collapse ">
            <thead className="border-b-0.3 border-b-primary-6">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`table-header ${col.sortable ? "flex items-center gap-2" : null
                      } whitespace-nowrap text-left text-primary-8 text-body-1 font-semibold`}
                  >
                    {col.header}
                    {col.sortable ? (
                      <button
                        onClick={col.onSort}
                        className="block"
                        title={
                          col.sortOrder === "asc"
                            ? "Ascending"
                            : "Descending"
                        }
                      >
                        <SortIcon />
                      </button>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((row, rowIndex) => (
                <tr
                  className="border-b-0.3 border-primary-6 hover:bg-primary-1"
                  key={rowIndex}
                >
                  {/* For Cells */}
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`table-cell text-left whitespace-nowrap text-sm text-gray-700`}
                    >
                      {col.render ? (
                        col.render(row)
                      ) : col.isDate ? (
                        new Date(row[col.key]).toDateString()
                      ) : col.key === 'serial' ? (rowIndex + 1) : !row[col.key] ? (
                        <>--</>
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}

                  {/* For Dropdown */}
                  {isDropdown ? (
                    <td>
                      {dropdownItems(row).length > 0 ? (
                        <Dropdown>
                          <Dropdown.Button
                            type="clean"
                            className="table-cell px-1"
                          >
                            <span className="font-bold">&#8942;</span>
                          </Dropdown.Button>
                          <Dropdown.Menu origin="top-right">
                            {dropdownItems(row).map((dropdownItem, index) => (
                              <Dropdown.Item
                                onClick={dropdownItem.onClick}
                                key={index}
                                className={dropdownItem.className}
                              >
                                <Image
                                  src={dropdownItem.icon}
                                  alt={dropdownItem.text}
                                />
                                <p>{dropdownItem.text}</p>
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="table-bottom flex flex-wrap justify-between items-center gap-x-2 gap-y-5 p-4 bg-white border border-primary-3 border-t-0 rounded-b-xl min-w-full">
        <div className="flex items-center gap-2">
          <p className="text-body-2 text-black-7">Entries per page</p>
          <Dropdown>
            <Dropdown.Button>
              {limitProps.selectedLimit}
              <Image src={down} alt="Down" />
            </Dropdown.Button>
            <Dropdown.Menu origin="bottom-right">
              <Dropdown.Item
                onClick={() => {
                  limitProps.onLimitChange(10);
                }}
              >
                10
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  limitProps.onLimitChange(20);
                }}
              >
                20
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  limitProps.onLimitChange(30);
                }}
              >
                30
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Pagination
          currentPage={paginationProps.currentPage}
          totalPages={paginationProps.totalPages}
          onPageChange={paginationProps.onPageChange}
        />
      </div>
    </div>
  );
}
