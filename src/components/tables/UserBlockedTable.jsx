import React from "react";
import unblockUser from "../../../public/icons/misc/unblock.svg";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";
import Table from "@/components/Table";
import Link from "next/link";
import { useRouter } from "next/router";
import Dropdown from "@/components/dropdown";
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

const data = [
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 2,
    pi: "Profile Image",
    name: "Ama Serwaa",
    id: "#7895",
    age: "30yrs",
    gender: "Female",
    nationality: "Ghana",
    phone: "233-277890123",
    email: "User2@info.com",
    createdDate: "04/12/23",
  },
  {
    sno: 3,
    pi: "Profile Image",
    name: "Kwame Nkrumah",
    id: "#1248",
    age: "45yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "233-541234567",
    email: "User3@info.com",
    createdDate: "05/12/23",
  },
  {
    sno: 4,
    pi: "Profile Image",
    name: "Adwoa Agyeman",
    id: "#9632",
    age: "28yrs",
    gender: "Female",
    nationality: "Ghana",
    phone: "233-208765432",
    email: "User4@info.com",
    createdDate: "06/12/23",
  },
  {
    sno: 5,
    pi: "Profile Image",
    name: "Kojo Mensah",
    id: "#3579",
    age: "52yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "233-552147890",
    email: "User5@info.com",
    createdDate: "07/12/23",
  },
  {
    sno: 6,
    pi: "Profile Image",
    name: "Esi Kom",
    id: "#8214",
    age: "37yrs",
    gender: "Female",
    nationality: "Ghana",
    phone: "233-246987531",
    email: "User6@info.com",
    createdDate: "08/12/23",
  },
  {
    sno: 7,
    pi: "Profile Image",
    name: "Kwesi Arthur",
    id: "#0951",
    age: "25yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "233-509876543",
    email: "User7@info.com",
    createdDate: "09/12/23",
  },
  {
    sno: 8,
    pi: "Profile Image",
    name: "Akosua Frema",
    id: "#6321",
    age: "41yrs",
    gender: "Female",
    nationality: "Ghana",
    phone: "233-265432178",
    email: "User8@info.com",
    createdDate: "10/12/23",
  },
];

export default function Blocked() {
  const router = useRouter();

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
            <Table.Cell>{item.pi}</Table.Cell>
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
