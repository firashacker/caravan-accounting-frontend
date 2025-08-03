import { useState } from "react";
import apiInstance from "../lib/axios";
import FormInput from "../components/FormInput/FormInput.component";
import DefaultButton from "../components/Button/Button.component";
import { addEmployee } from "../state/Employees/Employees.slice";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";

type PaymentMethod = {
  id: number;
  name: "حساب يومي" | "حساب اسبوعي" | "حساب شهري";
  method: "dayly" | "weekly" | "monthly";
};
const paymentMethods: PaymentMethod[] = [
  { id: 1, name: "حساب يومي", method: "dayly" },
  { id: 2, name: "حساب اسبوعي", method: "weekly" },
  { id: 3, name: "حساب شهري", method: "monthly" },
];

const EmployeeUpload = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>();
  const [salary, setSalary] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].method);
  const [balance, setBalance] = useState(0);
  const [clicked, setclicked] = useState(false);

  console.log(name, salary, paymentMethod, balance);

  const ShowUpload = () => {
    if (clicked) return;

    return (
      <DefaultButton
        extraClasses="min-w-full py-3"
        onButtonClick={() => {
          handelSubmit();
        }}
      >
        Post
      </DefaultButton>
    );
  };

  const handelSubmit = async () => {
    if (!name) return alert("لا يمكن ترك الاسم فارغاً");
    if (!salary) return alert("لا يمكن ترك المرتب فارغاً");
    if (!confirm("متأكد؟")) return;
    setclicked(true);
    try {
      let payload;
      if (paymentMethod === "dayly") {
        payload = {
          name: name,
          dayly: salary,
          days: balance / salary,
        };
      } else if (paymentMethod === "weekly") {
        payload = {
          name: name,
          weekly: salary,
          weeks: balance / salary,
        };
      } else if (paymentMethod === "monthly") {
        payload = {
          name: name,
          monthly: salary,
          months: balance / salary,
        };
      }
      const response = await apiInstance.post("/api/employee", payload);
      dispatch(addEmployee(response.data));
      setTimeout(() => window.history.back(), 500);
    } catch (error) {
      alert(error);
      setclicked(false);
    }
  };

  return (
    <div className="pb-10 max-w-sm mx-auto">
      {clicked && <Spinner />}
      <div className="mb-5 pt-12 ">
        <FormInput
          inputId="Name"
          label="اسم العامل"
          inputType="text"
          inputPlaceHolder="الاسم"
          inputRequired={true}
          onInputChange={(event) => {
            setName(event.target.value);
          }}
          inputName="Name"
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="sections"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          اختر الية الحساب
        </label>
        <select
          onChange={(event) => {
            setPaymentMethod(event.target.value);
            console.log(paymentMethod);
            //console.log(event.target.value);
          }}
          id="sections"
          className="border-gray border-2 w-full px-4 py-3 rounded-lg border-gray-200 bg-white shadow-sm appearance-none focus:border-blue-500 outline-none focus:ring-2 ring-blue-500"
        >
          {paymentMethods.map((method) => (
            <option key={method.id} value={method.method}>
              {method.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <FormInput
          inputId="Salary"
          label="مرتب العامل"
          inputType="text"
          inputPlaceHolder={`المرتب ${paymentMethods.find((method) => method.method === paymentMethod)?.name.split(" ")[1]}`}
          inputRequired={true}
          onInputChange={(event) => {
            setSalary(Number(event.target.value));
          }}
          inputName="Salary"
        />
      </div>
      <div className="mb-5">
        <FormInput
          inputId="Balance"
          label="الرصيد الحالي"
          inputType="text"
          inputPlaceHolder="رصيد العامل نقداً لحظة تسجيله"
          inputRequired={true}
          onInputChange={(event) => {
            setBalance(Number(event.target.value));
          }}
          inputName="Balance"
        />
      </div>

      {/*<div className="mb-5">
        <FormInput
          inputId="description"
          label="description"
          inputOptions={{
            type: "text",
            required: false,
            onChange: (event: any) => {
              setDescription(event.target.value);
            },
            name: "discription",
            placeholder: "Discription",
          }}
        />
      </div>*/}

      <ShowUpload />
    </div>
  );
};

export default EmployeeUpload;
