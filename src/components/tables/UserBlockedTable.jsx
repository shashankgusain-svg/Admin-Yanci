import React from "react";
import unblockUser from "../../../public/icons/misc/unblock.svg";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";
import Table from "@/components/table/TableIndex";
import Link from "next/link";
import { useRouter } from "next/router";
import Dropdown from "@/components/dropdown/DropdownIndex";
import Image from "next/image";

const headers = [
  "SNo",
  "P.I",
  "Name",
  "ID",
  "Age",
  "Gender",
  "Nationality",
  "Phone",
  "Email",
  "Created Date",
];

export default function Blocked() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://3.139.241.224:8000/v1/adminuser/getusers?isBlocked=true&page=1&limit=10");
      const result = await res.json();
      setData(result.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <Table
        headers={headers}
        title="User's Details"
        searchBar
        searchPlaceHolder="Search with Yanci ID"
        exportToCSV
        datePicker
      >
        {data.map((item, index) => (
          <Table.Row key={index}>
            <Table.Cell>{item.sno}</Table.Cell>
            <Table.Cell>{item.profilePic}</Table.Cell>
            <Table.Cell>
              <Link
                href={`user/${item.name}`}
                className="text-primary-7 hover:underline"
              >
                {item.name}
              </Link>
            </Table.Cell>
            <Table.Cell>{item.id}</Table.Cell>
            <Table.Cell>{item.age}</Table.Cell>
            <Table.Cell>{item.gender}</Table.Cell>
            <Table.Cell>{item.nationality}</Table.Cell>
            <Table.Cell>{item.phone}</Table.Cell>
            <Table.Cell>{item.email}</Table.Cell>
            <Table.Cell>{item.createdDate}</Table.Cell>
            <td>
              <Dropdown>
                <Dropdown.Button type="clean" className="table-cell px-1">
                  <span className="font-bold">&#8942;</span>
                </Dropdown.Button>
                <Dropdown.Menu origin="bottom-right">
                  <Dropdown.Item
                    onClick={() => {
                      router.push(`user/${item.name}`);
                    }}
                  >
                    <Image src={viewDetails} alt="View Details" />
                    <p>View Details</p>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Image src={unblockUser} alt="Unblock User" />
                    <p>Unblock User</p>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </Table.Row>
        ))}
      </Table>
    </>
  );
}
