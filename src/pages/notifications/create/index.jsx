import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import { createNotification } from "@/services/api/notificationsService";
import { useRouter } from "next/router";
import { isRequired } from "@/utils/helpers";
import { toast } from "react-toastify";

export default function CreateNotification() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [notification, setNotification] = React.useState({
    title: "",
    targetCustomer: "",
    mode: "",
    description: "",
    isScheduled: false,
    scheduleDate: new Date(),
    scheduleTime: {
      hours: 12,
      minutes: 30,
      ampm: "AM",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotification((prevNotification) => ({
      ...prevNotification,
      [name]: value,
    }));
  };

  const handleTimeChange = (e, field) => {
    const value = e.target.value;
    setNotification((prevNotification) => ({
      ...prevNotification,
      scheduleTime: {
        ...prevNotification.scheduleTime,
        [field]: value,
      },
    }));
  };

  const toggleScheduled = () => {
    setNotification((prevNotification) => ({
      ...prevNotification,
      isScheduled: !prevNotification.isScheduled,
    }));
  };

  const formatScheduledTime = () => {
    const { hours, minutes, ampm } = notification.scheduleTime;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const formatDate = (date) => {
    const tempDate = new Date(date);

    let year = tempDate.getFullYear();
    let month = (1 + tempDate.getMonth()).toString().padStart(2, "0");
    let day = tempDate.getDate().toString().padStart(2, "0");

    return month + "/" + day + "/" + year;
  };
  const formatDateForInput = (date) => {
    if (!date) return ""; // Handle null or undefined dates
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(notification?.isScheduled){
      console.log("notification.scheduleDate",notification?.scheduleDate)
      !isRequired(notification?.scheduleDate,"Notification's Date & Time", true)
    }
    if (
      !isRequired(notification.title, "Notification's Title", true) ||
      
      !isRequired(
        notification.description,
        "Notification's Description",
        true
      ) ||
      !isRequired(notification.mode, "Notification's Mode", true) ||
      !isRequired(
        notification.targetCustomer,
        "Notification's Target Customer",
        true
      )
    ) {
      return;
    }

    setLoading(true);

    const formattedNotification = notification.isScheduled
      ? {
          title: notification.title,
          description: notification.description,
          targetCustomer: notification.targetCustomer,
          mode: notification.mode,
          isScheduled: notification.isScheduled,
          scheduleDate: formatDate(notification.scheduleDate),
          scheduleTime: formatScheduledTime(),
        }
      : {
          title: notification.title,
          description: notification.description,
          targetCustomer: notification.targetCustomer,
          mode: notification.mode,
        };

    await createNotification(formattedNotification);
    setLoading(false);
    router.push("/notifications");
  };

  const breadCrumbItems = [
    { name: "Home", link: "/" },
    { name: "Notification Management", link: "/notifications" },
    { name: "Create Notification" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <form
        className="flex flex-col gap-8 max-w-report"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4">
          <InputAndLabel>
            <InputAndLabel.Label htmlFor="title" className="text-primary-6">
              Notification Title
            </InputAndLabel.Label>
            <InputAndLabel.Input
              id="title"
              name="title"
              value={notification.title}
              onChange={handleChange}
              maxLength={60}
              showLimit
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label
              htmlFor="targetCustomer"
              className="text-primary-6"
            >
              Target Customer
            </InputAndLabel.Label>
            <InputAndLabel.Select
              name="targetCustomer"
              id="targetCustomer"
              value={notification.targetCustomer}
              onChange={handleChange}
            >
              <InputAndLabel.Option value="" disabled>
                Select Customer
              </InputAndLabel.Option>
              <InputAndLabel.Option value="ALL_UNFUNDED_ACCOUNTS">
                All funded accounts
              </InputAndLabel.Option>
              <InputAndLabel.Option value="ALL_USERS">
              All Users
              </InputAndLabel.Option>
              <InputAndLabel.Option value="NO_TRANSACTION_MADE">
                No transactions made
              </InputAndLabel.Option>
              <InputAndLabel.Option value="MONTHLY_ACTIVE_USERS">
                Monthly active users
              </InputAndLabel.Option>
              <InputAndLabel.Option value="NON_ACTIVE_USERS">
                Non active users
              </InputAndLabel.Option>
              <InputAndLabel.Option value="ABANDONED_KYC">
                Abandoned KYC
              </InputAndLabel.Option>
              <InputAndLabel.Option value="NEW_USERS">
                New users
              </InputAndLabel.Option>
            </InputAndLabel.Select>
          </InputAndLabel>
          <InputAndLabel>
            <InputAndLabel.Label className="text-primary-6" htmlFor="mode">
              Mode
            </InputAndLabel.Label>
            <InputAndLabel.Select
              name="mode"
              id="mode"
              value={notification.mode}
              onChange={handleChange}
            >
              <InputAndLabel.Option value="" disabled>
                Type
              </InputAndLabel.Option>
              <InputAndLabel.Option value="EMAIL">Email</InputAndLabel.Option>
              <InputAndLabel.Option value="SMS">SMS</InputAndLabel.Option>
            </InputAndLabel.Select>
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label
              htmlFor="description"
              className="text-primary-6"
            >
              Notification Description
            </InputAndLabel.Label>
            <InputAndLabel.TextArea
              className="min-h-40"
              id="description"
              name="description"
              value={notification.description}
              onChange={handleChange}
              placeHolder="Notification Text"
              maxLength={200}
              showLimit
            />
          </InputAndLabel>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="scheduleNotification"
              name="scheduleNotification"
              onChange={toggleScheduled}
            />
            <label
              htmlFor="scheduledNotification"
              className="text-body-2 text-primary-6"
            >
              Schedule Notification
            </label>
          </div>

          {notification.isScheduled ? (
            <div className="grid grid-cols-2 gap-8">
              <InputAndLabel>
                <InputAndLabel.Label
                  htmlFor="scheduleDate"
                  className="text-body-2 text-primary-6"
                >
                  Set Date
                </InputAndLabel.Label>
                <InputAndLabel.Input
                  id="scheduleDate"
                  name="scheduleDate"
                  isRequired
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formatDateForInput(notification?.scheduleDate)}
                  onChange={handleChange}
                />
              </InputAndLabel>
              <div className="time-picker">
                <InputAndLabel.Label className="text-body-2 text-primary-6">
                  Set Time:
                </InputAndLabel.Label>
                <div className="time-inputs flex items-center gap-2">
                  <InputAndLabel.Input
                    type="number"
                    min="1"
                    max="12"
                    isRequired
                    value={notification.scheduleTime.hours}
                    onChange={(e) => handleTimeChange(e, "hours")}
                  />
                  <span>:</span>
                  <InputAndLabel.Input
                    type="number"
                    min="0"
                    max="59"
                    value={notification.scheduleTime.minutes}
                    onChange={(e) => handleTimeChange(e, "minutes")}
                  />
                  <InputAndLabel.Select
                    value={notification.scheduleTime.ampm}
                    onChange={(e) => handleTimeChange(e, "ampm")}
                  >
                    <InputAndLabel.Option value="AM">AM</InputAndLabel.Option>
                    <InputAndLabel.Option value="PM">PM</InputAndLabel.Option>
                  </InputAndLabel.Select>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <Button
          title="Send Notification"
          type="submit"
          isLoading={loading}
          className="max-w-72"
          design="submit"
        >
          Send Notification
        </Button>
      </form>
    </div>
  );
}
