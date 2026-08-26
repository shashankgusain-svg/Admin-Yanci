import { useEffect } from "react";
import { useRouter } from "next/router";

export default function StockRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/stock/company-data");
  }, [router]);

  return null;
}
