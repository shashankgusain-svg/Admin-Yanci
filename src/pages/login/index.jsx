import React from "react";
import Image from "next/image";
import welcomeImg from "../../../public/images/welcomeImg.png";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import { useRouter } from "next/router";
import { getToken } from "@/services/api/authService";
import { setToken, setUser } from "@/services/api/cookies";
import { verifyPassword, verifyEmail } from "@/utils/helpers";
import LoadingAnimation from "../../../public/icons/animated/loading";

export default function Login() {
  const [fields, setFields] = React.useState({ email: "", password: "" });
  const [expiry, setExpiry] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const isEmailValid = verifyEmail(fields.email);
    const isPasswordValid = verifyPassword(fields.password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const data = await getToken(fields);
      if (data) {
        setToken(data.token, expiry);
        setUser(data, expiry);
        router.push("/");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  const emailHandler = (e) => {
    setFields((prev) => ({ ...prev, email: e.target.value }));
  };
  const passwordHandler = (e) => {
    setFields((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleExpiryChange = (e) => {
    setExpiry(e.target.checked);
  };

  return (
    <div className="wrapper">
      <div className="layout-container">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left Section */}
          <div
            className="bg-primary-7 basis-[45%] p-20 relative overflow-hidden flex flex-col justify-start items-center
        after:w-[30rem] after:h-[30rem] after:border-[0.5rem] after:rounded-full after:absolute after:border-white after:-top-[45%] after:-left-[45%]
        before:w-[30rem] before:h-[30rem] before:border-[0.5rem] before:rounded-full before:absolute before:border-white before:-bottom-[45%] before:-right-[45%]
      "
          >
            <div className="flex flex-col gap-4 items-center lg:items-start">
              <h1 className="text-[3.75rem] text-center lg:text-left text-white leading-[1.2] font-bold">
                Welcome to Yanci
              </h1>
              <p className="text-heading-6 text-black-5 text-center lg:text-left">
                Clarity gives you the blocks & components you need to create a
                truly professional website.
              </p>
            </div>
            <div className="relative w-[250px] mx-auto mt-20">
              <Image src={welcomeImg} alt="Welcome Image" />
            </div>
          </div>

          {/* Right Section */}
          <div className="basis-[55%] p-20 bg-white flex">
            <div className="w-full">
              <h2 className="text-[3.25rem] leading-[1.2] font-bold mb-6">
                Welcome back!
              </h2>
              <form
                className="w-full max-w-[500px] flex flex-col gap-10 mt-24"
                onSubmit={handleLogin}
              >
                <InputAndLabel>
                  <InputAndLabel.Label htmlFor="email">
                    Email address
                  </InputAndLabel.Label>
                  <InputAndLabel.Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={fields.email}
                    onChange={emailHandler}
                    disabled={loading}
                  />
                </InputAndLabel>

                <InputAndLabel>
                  <InputAndLabel.Label htmlFor="password">
                    Password
                  </InputAndLabel.Label>
                  <InputAndLabel.Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={fields.password}
                    onChange={passwordHandler}
                    disabled={loading}
                  />
                </InputAndLabel>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      type="checkbox"
                      onChange={handleExpiryChange}
                      checked={fields.expiry}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember_me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                <Button className="w-60 mt-10" type="submit" style="primary">
                  {loading ? <LoadingAnimation theme="light" /> : "Login"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
