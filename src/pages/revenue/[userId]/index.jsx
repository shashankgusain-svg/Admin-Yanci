import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import Image from "next/image";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import React from "react";
import { useRouter } from "next/router";
import RevenueUserTable from "@/components/tables/RevenueUserTable";

export default function index() {
  const router = useRouter();
  const { userId } = router.query;

  const breadCrumbItems = [
    { name: "Home", Link: "/" },
    { name: "Revenue Management" },
    { name: userId },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <Image alt="Profile Image"
        className="w-28 h-28"
        //   src="https://s3-alpha-sig.figma.com/img/219f/f04e/13cf071c2722391e99b58166825c9b6c?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AJjyug6U1F4mk4Hl3m~kB86pl03Spr6TYFZdcPX1~CNsEwd86E1D9oXxrn7ID0PBgAhbk5PilDfR7IXlN6HLrcQiyELI0h3~xpgHXAfv41kyE3v94311OwqCReUFf9MwATZ9t7CxLik6FSXCTKNt-d4T8i7uMLtU-8C2p9x~u70OBdVQ2YcmelBrySUugPbQKdwaf2PH8sXP63twEEpwZAGfdOm0qydPwvMv4c8f3m6qHUDNhgss-VgOBZ6K9aHpCezrpZp1eSoKll95lffPkLC5vLprmO77kiKb5swVjRHpcHsce7u5-pgoxEyW9cRCYnhlyaNZ~xPC7H7oI7R9jA__"
      />
      <div className="grid grid-cols-4 gap-8">
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="firstName">
            First Name
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="firstName"
            id="firstName"
            value="Jerome"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="lastName">
            Last Name
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="lastName"
            id="lastName"
            value="Bell"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="totalTransactionAmount">
            Total Transaction Amount
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="totalTransactionAmount"
            id="totalTransactionAmount"
            value="GHC 18,67,548"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="currentBalance">
            Current Balance
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="currentBalance"
            id="currentBalance"
            value="GHC 18,67,548"
          />
        </InputAndLabel>
      </div>
      <RevenueUserTable/>
    </div>
  );
}
