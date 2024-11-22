import MetricsCard from "@/components/metricsCard/MetricsCard";
import { getUser } from "@/services/api/cookies";
import React from "react";

const dummyMetrics = [
  // {
  //   label: "Total Users",
  //   percentageChange: 0,
  //   value: 0,
  //   isPositiveChange: true,
  // },
  {
    label: "Trading Volume",
    percentageChange: 0,
    isDollar: true,
    value: 0,
    isPositiveChange: true,
  },
  {
    label: "Total Orders",
    percentageChange: 0,
    value: 0,
    isPositiveChange: true,
  },
  {
    label: "Total Revenue",
    percentageChange: 0,
    isDollar: true,
    value: 0,
    isPositiveChange: true,
  },
];

export default function Home() {
  const [user, setUser] = React.useState({
    user: {
      user: {
        name : ""
      },
    },
    token: "",
  });

  React.useEffect(() => {
    const fetchUserData = async () => {
      const temp = await getUser();
      console.log(temp)
      setUser({ ...temp });
    };
    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-heading-2 text-black-13 font-semibold">
          Hi{" "}
          <span className="text-primary-6 fadeIn">
            {user.user.name || "Name Unavailable From API"}
          </span>
        </h2>
        <p className="text-heading-5 text-black-13 font-semibold mt-1">
          Welcome to Yanci
        </p>
      </div>

      <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
        {dummyMetrics.map((stat, index) => (
          <MetricsCard
            key={index}
            label={stat.label}
            isPercentage={stat.isPercentage ? stat.isPercentage : false}
            percentageChange={stat.percentageChange}
            value={stat.value}
            isPositiveChange={stat.isPositiveChange}
            isDollar={stat.isDollar}
          />
        ))}
      </div>
    </div>
  );
}
