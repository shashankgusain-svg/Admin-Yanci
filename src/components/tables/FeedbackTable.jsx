import React from "react";
import Table from "@/components/Table";
import Image from "next/image";
import starRating from "../../../public/icons/misc/starRating.svg";

const headers = ["SNo", "Yanci ID", "Rating", "Comments", "Sent on"];

const queries = [
  {
    SNo: 1,
    yanciID: "#6371",
    rating: 3,
    comments:
      "Join our community ride this weekend! Meet fellow MopedSafe users.",
    sentOn: "03/12/23",
  },
  {
    SNo: 2,
    yanciID: "#479147",
    rating: 4,
    comments:
      "Join our community ride this weekend! Meet fellow MopedSafe users.",
    sentOn: "03/12/23",
  },
  {
    SNo: 3,
    yanciID: "#6371",
    rating: 5,
    comments:
      "Join our community ride this weekend! Meet fellow MopedSafe users.",
    sentOn: "03/12/23",
  },
  {
    SNo: 4,
    yanciID: "#6371",
    rating: 2,
    comments:
      "Join our community ride this weekend! Meet fellow MopedSafe users.",
    sentOn: "03/12/23",
  },
];

export default function FeedbackTable() {
  return (
    <>
      <Table
        headers={headers}
        title="Feedback"
        searchPlaceHolder="Search with Yanci ID"
        searchBar
        exportToCSV
      >
        {queries.map((item, index) => (
          <Table.Row key={index}>
            <Table.Cell>{item.SNo}</Table.Cell>
            <Table.Cell>{item.yanciID}</Table.Cell>
            <Table.Cell>
              <div className="flex gap-2">
                {Array(item.rating)
                  .fill()
                  .map((_, i) => (
                    <Image
                      key={i}
                      src={starRating}
                      alt="Star"
                      width={20}
                      height={20}
                    />
                  ))}
              </div>
            </Table.Cell>
            <Table.Cell>{item.comments}</Table.Cell>
            <Table.Cell>{item.sentOn}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </>
  );
}
