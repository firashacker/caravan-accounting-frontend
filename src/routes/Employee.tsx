import { useSelector } from "react-redux";
import { type RootState } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type EmployeeType } from "../state/Employees/Employees.slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../state/store";
import { fetchEmployees } from "../state/Employees/Employees.slice";

import { faPerson } from "@fortawesome/free-solid-svg-icons";
import DefaultButton, {
  DangerButton,
} from "../components/Button/Button.component";
import apiInstance from "../lib/axios";

const paymentMethods1 = { dayly: "يوم", weekly: "اسبوع", monthly: "شهر" };
const paymentMethods2 = { dayly: "ايام", weekly: "اسابيع", monthly: "اشهر" };

function Employee() {
  const { employeeList, status } = useSelector(
    (state: RootState) => state.employees,
  );
  const dispatch = useDispatch<AppDispatch>();
  const employeeId = useParams().id;
  const [employee, setEmployee] = useState<EmployeeType>();
  const [payment, setPayment] = useState("");

  const paymentType = () => {
    switch (employee?.paymentMethod) {
      case "dayly":
        setPayment("ايام");
        break;
      case "weekly":
        setPayment("اسابيع");
        break;
      case "monthly":
        setPayment("اشهر");
        break;
    }
  };

  useEffect(() => {
    paymentType();
  }, [employee]);
  useEffect(() => {
    const result = employeeList.find((e) => e.id === Number(employeeId));
    setEmployee(result);
  }, [employeeId]);

  const handleAddDay = () => {
    if (employee) {
      setEmployee({
        ...employee,
        paymentUnits: Number(employee?.paymentUnits + 1),
      });
    }
  };

  const handleAddDays = () => {
    const days = prompt(`عدد ال${resolveMethods2()}`);
    if (!days) return;
    console.log(days);
    if (employee) {
      setEmployee({
        ...employee,
        paymentUnits: Number(employee.paymentUnits + Number(days)),
      });
    }
  };

  const handleAddExpense = () => {
    const amount = prompt("مبلغ الدفعة؟");
    if (!amount) return;
    if (employee) {
      setEmployee({
        ...employee,
        //paymentUnits: Number(
        //employee.paymentUnits -
        //    Math.floor(Number(amount) / employee.paymentAmount),
        //),
        balance: employee.balance + Number(amount),
      }); //Fix Please
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await apiInstance.put("/api/employee", employee);
      dispatch(fetchEmployees());
      console.log(response);
    } catch (error) {
      alert(error);
    }
  };

  const resolveMethods1 = () => {
    if (employee) return paymentMethods1[employee.paymentMethod];
    else return "";
  };
  const resolveMethods2 = () => {
    if (employee) return paymentMethods2[employee.paymentMethod];
    else return "";
  };

  const calculateAmount = () => {
    if (employee) {
      const result = Number(employee.paymentAmount * employee.paymentUnits);
      return result;
    }
    return 0;
  };
  const calculateBalance = () => {
    if (employee)
      return employee.paymentAmount * employee.paymentUnits - employee.balance;
    else return 0;
  };

  return (
    <>
      {status === "loading" && <Spinner />}

      <div className=" p-8 flex flex-col  space-x-4">
        <div className="flex pb-4 text-xl">
          <FontAwesomeIcon className="p-1" icon={faPerson} />
          <h1>{employee?.name}</h1>
          <p className="px-2 text-sm">[عامل]</p>
        </div>
      </div>
      <table className="min-w-full border-s-slate-950 border-2">
        <thead>
          <tr className="bg-blue-200">
            <td className="p-4 ">المعرف</td>
            <td className="p-4">القيمة</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">الية الحساب</td>
            <td className="border-s-slate-950 border-2 p-2">{payment}</td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2"> المرتب</td>
            <td className="border-s-slate-950 border-2 p-2">
              <p> ₪ {employee?.paymentAmount}</p>
            </td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">
              <div className="flex space-x-2">
                <p>عدد ال{payment}</p>
              </div>
            </td>
            <td className="border-s-slate-950 border-2 p-2">
              {employee?.paymentUnits}
            </td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">
              <p>المجموع</p>
            </td>
            <td className="border-s-slate-950 border-2 p-2">
              <div className="flex space-x-4">
                <p> ₪ {Math.abs(calculateAmount())}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">
              <p>المدفوع</p>
            </td>
            <td className="border-s-slate-950 border-2 p-2">
              <div className="flex space-x-4">
                <p> ₪ {employee?.balance}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">
              <p>المحصلة</p>
            </td>
            <td className="border-s-slate-950 border-2 p-2 bg-green-200">
              <div className="flex space-x-4">
                <p> ₪ {Math.abs(calculateBalance())}</p>
                <p className="text-red-500">
                  {calculateBalance() >= 0 ? "له" : "عليه"}
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="p-8 space-x-2">
        <DefaultButton onButtonClick={handleAddDay}>
          اضافة {resolveMethods1()}
        </DefaultButton>
        <DefaultButton onButtonClick={handleAddDays}>
          اضافة {resolveMethods2()}
        </DefaultButton>
        <DefaultButton onButtonClick={handleAddExpense}>
          تسجيل دفعة
        </DefaultButton>
        <DangerButton onButtonClick={handleSubmit}>تأكيد و حفظ</DangerButton>
      </div>
    </>
  );
}

export default Employee;
