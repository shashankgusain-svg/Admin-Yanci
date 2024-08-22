import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import InputAndLabel from "@/components/inputandlabel";
import Image from "next/image";
import React from "react";

export default function UserPage() {
  const breadCrumbItems = [
    { name: "Home", Link: "/" },
    { name: "User Management", Link: "/" },
    { name: "User Management" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <Image
          className="w-28 h-28"
          //   src="https://s3-alpha-sig.figma.com/img/219f/f04e/13cf071c2722391e99b58166825c9b6c?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AJjyug6U1F4mk4Hl3m~kB86pl03Spr6TYFZdcPX1~CNsEwd86E1D9oXxrn7ID0PBgAhbk5PilDfR7IXlN6HLrcQiyELI0h3~xpgHXAfv41kyE3v94311OwqCReUFf9MwATZ9t7CxLik6FSXCTKNt-d4T8i7uMLtU-8C2p9x~u70OBdVQ2YcmelBrySUugPbQKdwaf2PH8sXP63twEEpwZAGfdOm0qydPwvMv4c8f3m6qHUDNhgss-VgOBZ6K9aHpCezrpZp1eSoKll95lffPkLC5vLprmO77kiKb5swVjRHpcHsce7u5-pgoxEyW9cRCYnhlyaNZ~xPC7H7oI7R9jA__"
        />
        <div className="grid grid-cols-3 gap-8">
          <InputAndLabel>
            <InputAndLabel.Label htmlFor="firstName">
              First Name
            </InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="firstName"
              id="firstName"
              placeHolder="Dummy Name"
              required
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
              placeHolder="Dummy Last Name"
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="gender">Gender</InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="gender"
              id="gender"
              placeHolder="Gender"
              required
            />
          </InputAndLabel>

          <div className="grid grid-cols-2 gap-8">
            <InputAndLabel>
              <InputAndLabel.Label htmlFor="yanciId">
                Yanci ID
              </InputAndLabel.Label>
              <InputAndLabel.Input
                disabled
                name="yanciId"
                id="yanciId"
                placeHolder="Yanci ID"
                required
              />
            </InputAndLabel>

            <InputAndLabel>
              <InputAndLabel.Label htmlFor="csdId">CSD ID</InputAndLabel.Label>
              <InputAndLabel.Input
                disabled
                name="csdId"
                id="csdId"
                placeHolder="CSD ID"
                required
              />
            </InputAndLabel>
          </div>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="age">Age</InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="age"
              id="age"
              placeHolder="Age"
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="nationality">
              Nationality
            </InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="nationality"
              id="nationality"
              placeHolder="Nationality"
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="phone">Phone</InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="phone"
              id="phone"
              placeHolder="Phone Number"
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="email">Email</InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="email"
              id="email"
              placeHolder="Email Address"
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="registeredOn">
              Registered On
            </InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="registeredOn"
              id="registeredOn"
              placeHolder="Registration Date"
              required
            />
          </InputAndLabel>
        </div>
      </div>
    </div>
  );
}
