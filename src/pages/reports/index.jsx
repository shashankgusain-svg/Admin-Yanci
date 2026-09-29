import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import { downloadAdminReport, getReportOptions } from "@/services/api/analyticsService";
import { toast } from "react-toastify";
import PageHeader from "@/components/pageHeader/PageHeader";

const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "Reports" }];

export default function Reports() {
  const [options, setOptions] = React.useState({
    periods: [],
    reportTypes: [],
  });
  const [loadingOptions, setLoadingOptions] = React.useState(true);
  const [downloading, setDownloading] = React.useState(false);
  const [form, setForm] = React.useState({
    reportType: "ttb_commission",
    period: "this_month",
    from: "",
    to: "",
  });

  React.useEffect(() => {
    getReportOptions().then((res) => {
      if (res?.status && res.data) {
        setOptions({
          periods: res.data.periods || [],
          reportTypes: res.data.reportTypes || [],
        });
        const firstType = res.data.reportTypes?.[0]?.key || "";
        setForm((prev) => ({
          ...prev,
          reportType: prev.reportType || firstType,
          period: res.data.periods?.[0]?.key || "this_month",
        }));
      }
      setLoadingOptions(false);
    });
  }, []);

  const selectedPeriod = options.periods.find((p) => p.key === form.period);
  const showCustomDates = selectedPeriod?.requiresCustomDates || form.period === "custom";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reportType) {
      toast.error("Please select a report type.");
      return;
    }
    if (showCustomDates && (!form.from || !form.to)) {
      toast.error("Please select both start and end dates for a custom timeline.");
      return;
    }

    setDownloading(true);
    const payload = {
      reportType: form.reportType,
      period: form.period,
    };
    if (showCustomDates) {
      payload.from = form.from;
      payload.to = form.to;
    }

    const res = await downloadAdminReport(payload);
    setDownloading(false);
    if (res?.status) {
      toast.success("Report generated successfully.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      
      <PageHeader
        title="Reports"
        description="Generate and download operational reports."
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="w-full max-w-report grid grid-cols-1 gap-4">
          <InputAndLabel>
            <InputAndLabel.Label htmlFor="reportType" className="text-primary-6">
              Type of report
            </InputAndLabel.Label>
            <InputAndLabel.Select
              id="reportType"
              name="reportType"
              value={form.reportType}
              onChange={handleChange}
              disabled={loadingOptions}
            >
              <InputAndLabel.Option value="" disabled>
                Select report type
              </InputAndLabel.Option>
              {options.reportTypes.map((type) => (
                <InputAndLabel.Option key={type.key} value={type.key}>
                  {type.title}
                </InputAndLabel.Option>
              ))}
            </InputAndLabel.Select>
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="period" className="text-primary-6">
              Timeline
            </InputAndLabel.Label>
            <InputAndLabel.Select
              id="period"
              name="period"
              value={form.period}
              onChange={handleChange}
              disabled={loadingOptions}
            >
              {options.periods.map((period) => (
                <InputAndLabel.Option key={period.key} value={period.key}>
                  {period.label}
                </InputAndLabel.Option>
              ))}
            </InputAndLabel.Select>
          </InputAndLabel>

          {showCustomDates && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputAndLabel>
                <InputAndLabel.Label htmlFor="from" className="text-primary-6">
                  From
                </InputAndLabel.Label>
                <InputAndLabel.Input
                  id="from"
                  name="from"
                  type="date"
                  value={form.from}
                  onChange={handleChange}
                />
              </InputAndLabel>
              <InputAndLabel>
                <InputAndLabel.Label htmlFor="to" className="text-primary-6">
                  To
                </InputAndLabel.Label>
                <InputAndLabel.Input
                  id="to"
                  name="to"
                  type="date"
                  value={form.to}
                  onChange={handleChange}
                />
              </InputAndLabel>
            </div>
          )}

        </div>

        <Button className="w-72" type="submit" isLoading={downloading} disabled={loadingOptions}>
          {downloading ? "Generating PDF..." : "Generate Report"}
        </Button>
      </form>
    </div>
  );
}
