import React, { useState } from "react";
import FormInput from "../components/FormInput/FormInput.component";
import DefaultButton from "../components/Button/Button.component";
import Spinner from "../components/Spinner/Spinner.component";
import apiInstance from "../lib/axios";

const signUpEndPoint = "/api/signup";
interface SignUpValues {
  username: string;
  password: string;
  isAdmin: boolean | false;
}
interface Event {
  target: {
    value: string | number | boolean;
  };
}

const SignUp: React.FC = () => {
  const [error, setError] = useState<{
    data: string | "";
    status: number | 200;
  }>();
  const [loading, setLoading] = useState(false);
  const [signUpValues, setSignUpValues] = useState<SignUpValues>({
    username: "",
    password: "",
    isAdmin: false,
  });

  // ... (keep the handleSubmit function as is)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
    setLoading(true);
    try {
      const response = await apiInstance.post(signUpEndPoint, signUpValues);
      console.log(response);
      //dispatch(authLogin(signUpValues));
      //console.log(user);
      setTimeout(() => (window.location.href = "/"), 1000);
    } catch (error) {
      console.log(error);
      //@ts-expect-error @ts-ignore
      setError(error.response);
    }
    setLoading(false);
  };

  const setUsername = (e: Event) => {
    setSignUpValues({
      ...signUpValues,
      username: String(e.target.value),
    });
    console.log(signUpValues);
  };

  const setIsAdmin = (e: Event) => {
    switch (e.target.value) {
      case "true":
        setSignUpValues({ ...signUpValues, isAdmin: true });
        break;
      default:
        setSignUpValues({ ...signUpValues, isAdmin: false });
        break;
    }
  };

  const setPassword = (e: Event) => {
    setSignUpValues({ ...signUpValues, password: String(e.target.value) });
  };

  const ErrorMassage = () => {
    console.log(error);
    if (error) {
      if (error.data && error.status) {
        if (error.data !== "Network Error")
          switch (Number(error.status)) {
            case 401:
              return (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                  Error:Invalid Username or Password !
                </div>
              );
              break;
            case 403:
              return (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                  Error:Only Admin can Add Users !
                </div>
              );
              break;
            default:
              return (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                  Error:Unknown Error Occured !
                </div>
              );
              break;
          }
        else
          return (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              Error:Network Error !
            </div>
          );
      }
    }
  };

  return (
    <div className="h-screen min-w-full  flex items-center justify-center bg-gradient-to-bl from-cyan-200 to-blue-300 ">
      {loading && <Spinner />}
      {/* Main container with a gradient background and card */}
      <div
        className={`${signUpValues.isAdmin ? "bg-red-300" : "bg-white/90"} backdrop-blur-lg rounded-xl shadow-2xl p-10 w-full max-w-md mx-auto border border-gray-200`}
      >
        {/* Header: Login Title */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Sign Up
        </h2>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number Input */}

          <FormInput
            inputId="username"
            label="Username"
            inputType="text"
            inputRequired={true}
            onInputChange={setUsername}
            inputName="username"
            inputValue={signUpValues.username}
          />

          {/* Password Input */}

          <FormInput
            inputId="password"
            label="Password"
            inputType="password"
            inputRequired={true}
            onInputChange={setPassword}
            inputName="password"
            inputValue={signUpValues.password}
          />

          <div className="mb-5">
            <label
              htmlFor="isAdmin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              isAdmin
            </label>
            <select
              onChange={(event) => {
                setIsAdmin(event);
                console.log(signUpValues);
                //console.log(event.target.value);
              }}
              id="sections"
              className="border-gray border-2 w-full px-4 py-3 rounded-lg border-gray-200 bg-white shadow-sm appearance-none focus:border-blue-500 outline-none focus:ring-2 ring-blue-500"
            >
              <option key={1} value="false">
                No this User Is Not Admin
              </option>
              <option key={2} value="true">
                Yes this User Is Admin
              </option>
            </select>
          </div>

          {/* Error Message */}
          <ErrorMassage />

          {/* Submit Button and Sign Up Link */}
          <div className="flex items-center justify-center">
            <DefaultButton extraClasses="min-w-full p-3" buttonType="submit">
              SignUp
            </DefaultButton>
          </div>
        </form>

        {/* Additional Note
        <Link to="/signup">
          {" "}
          <p className="text-center text-gray-500 mt-4">
            Not registered? Click the link to sign up.
          </p>
          </Link>*/}
      </div>
    </div>
  );
};

export default SignUp;
