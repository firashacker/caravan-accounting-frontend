import React, { useEffect, useState } from "react";
import FormInput from "../components/FormInput/FormInput.component";
import { useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../state/store";
import { useDispatch } from "react-redux";
import { resetAuthError } from "../state/Auth/Auth.slice";
import { authLogin } from "../state/Auth/Auth.slice";
import DefaultButton from "../components/Button/Button.component";
import Spinner from "../components/Spinner/Spinner.component";

interface SigninValues {
  username: string;
  password: string;
}
interface Event {
  target: {
    value: string;
  };
}

const Login: React.FC = () => {
  const { error, user, status } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [signinValues, setSigninValues] = useState<SigninValues>({
    username: "",
    password: "",
  });

  useEffect(() => {
    //console.log(error);
    dispatch(resetAuthError());
  }, []);

  // ... (keep the handleSubmit function as is)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(authLogin(signinValues));
    console.log(user);
  };

  const setUsername = (e: Event) => {
    setSigninValues({
      ...signinValues,
      username: e.target.value,
    });
  };

  const setPassword = (e: Event) => {
    setSigninValues({ ...signinValues, password: e.target.value });
  };

  const ErrorMassage = () => {
    console.log(error);
    if (error.message !== "Network Error")
      switch (Number(error.message)) {
        case 401:
          return (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              Error:Invalid Username or Password !
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
  };

  return (
    <div className="h-screen min-w-full  flex items-center justify-center bg-gradient-to-bl from-cyan-200 to-blue-300 ">
      {status === "loading" && <Spinner />}
      {/* Main container with a gradient background and card */}
      <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl p-10 w-full max-w-md mx-auto border border-gray-200">
        {/* Header: Login Title */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Sign In
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
            inputValue={signinValues.username}
          />

          {/* Password Input */}

          <FormInput
            inputId="password"
            label="Password"
            inputType="password"
            inputRequired={true}
            onInputChange={setPassword}
            inputName="password"
            inputValue={signinValues.password}
          />

          {/* Error Message */}
          {error.message && <ErrorMassage />}

          {/* Submit Button and Sign Up Link */}
          <div className="flex items-center justify-center">
            <DefaultButton extraClasses="min-w-full p-3" buttonType="submit">
              Login
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

export default Login;
