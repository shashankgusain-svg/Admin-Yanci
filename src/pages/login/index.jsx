import React from "react";
import Image from "next/image";
import welcomeImg from "../../../public/images/welcomeImg.png";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import { useRouter } from "next/router";
import { getToken } from "@/services/api/authService";
import { setToken, setUser } from "@/services/api/cookies";
import { verifyPassword, verifyEmail } from "@/utils/helpers";
import { setLoggingOut } from "@/services/api/helper";

export default function Login() {
  const [fields, setFields] = React.useState({
    email: "",
    password: "",
    expiry: false,
  });
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    setLoggingOut(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const isEmailValid = verifyEmail(fields.email);
    const isPasswordValid = verifyPassword(fields.password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const res = await getToken({
        email: fields.email,
        password: fields.password,
      });
      if (res.status === false) {
        return;
      }
      const { token, ...userData } = res?.data || {};
      setToken(token, fields.expiry);
      setUser(userData, fields.expiry);
      router.replace("/");
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
    setFields((prev) => ({ ...prev, expiry: e.target.checked }));
  };

  return (
    <div className="wrapper bg-canvas min-h-screen">
      <div className="layout-container">
        <div className="flex flex-col lg:flex-row min-h-screen">
          <div className="bg-primary-1 basis-[45%] p-20 relative overflow-hidden flex flex-col justify-start items-center after:w-[30rem] after:h-[30rem] after:border-[0.5rem] after:rounded-full after:absolute after:border-primary-3 after:-top-[45%] after:-left-[45%] before:w-[30rem] before:h-[30rem] before:border-[0.5rem] before:rounded-full before:absolute before:border-primary-3 before:-bottom-[45%] before:-right-[45%]">
            <div className="flex flex-col gap-4 items-center lg:items-start relative z-10">
              <h1 className="text-[2.5rem] lg:text-[3rem] text-center lg:text-left text-navy leading-[1.2] font-bold">
                Welcome to Yanci
              </h1>
              <p className="text-heading-6 text-black-7 text-center lg:text-left max-w-md">
                Invest. Learn. Grow. Admin tools for Ghana&apos;s investing
                platform.
              </p>
            </div>
            <div className="relative w-[250px] mx-auto mt-20 z-10">
              <Image src={welcomeImg} alt="Welcome" />
            </div>
          </div>

          <div className="basis-[55%] p-20 bg-canvas flex">
            <div className="w-full max-w-[500px]">
              <h2 className="text-[2.5rem] lg:text-[3rem] leading-[1.2] font-bold mb-6 text-navy">
                Welcome back
              </h2>
              <form
                className="w-full max-w-[500px] flex flex-col gap-6 mt-24"
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
                      className="h-4 w-4 text-primary-6 focus:ring-primary-6 border-black-5 rounded"
                    />
                    <label
                      htmlFor="remember_me"
                      className="ml-2 block text-body-2 text-navy"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-body-2">
                    <a
                      href="#"
                      className="font-medium text-primary-6 hover:text-primary-7"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                <Button
                  isLoading={loading}
                  className="w-full max-w-[240px] mt-10"
                  type="submit"
                  design="primary"
                >
                  Log in
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
