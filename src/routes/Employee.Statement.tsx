import { useSelector } from "react-redux";
import { type RootState } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";

import { useEffect, useState } from "react";
import {
  employeesEndPoint,
  type EmployeeType,
} from "../state/Employees/Employees.slice";
import {
  expensesEndPoint,
  type ExpenseType,
} from "../state/Expenses/Expenses.slice";

import { useDispatch } from "react-redux";
import { type AppDispatch } from "../state/store";
import { fetchEmployees } from "../state/Employees/Employees.slice";

import DefaultButton, {
  DangerButton,
  SafeButton,
} from "../components/Button/Button.component";
import apiInstance from "../lib/axios";

const paymentMethods1 = { dayly: "يوم", weekly: "اسبوع", monthly: "شهر" };
const paymentMethods2 = { dayly: "ايام", weekly: "اسابيع", monthly: "اشهر" };

interface EmployeeStatementOptions {
  extraClasses?: string;
  employeeId: number;
}
function EmployeeStatement({
  employeeId,
  extraClasses,
}: EmployeeStatementOptions) {
  const { status } = useSelector((state: RootState) => state.employees);
  const [expense, setExpense] = useState<ExpenseType>();
  const dispatch = useDispatch<AppDispatch>();
  const [employee, setEmployee] = useState<EmployeeType>();
  const [method1, setMethod1] = useState("");
  const [method2, setMethod2] = useState("");
  const [reset, setReset] = useState(false);

  useEffect(() => {
    setMethod1(resolveMethods1);
    setMethod2(resolveMethods2);
  }, [employee]);

  useEffect(() => {
    const getEmployee = async (employeeId: number) => {
      const result = await apiInstance.get(`/api/employee/${employeeId}`);
      console.log(result);
      setEmployee(result.data);
    };
    getEmployee(Number(employeeId));
    setExpense(undefined);
  }, [employeeId, reset]);

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

  const handleAddExtra = () => {
    const amount = prompt("قيمة الدخل نقدأ");
    if (!amount) return;
    if (employee) {
      setEmployee({
        ...employee,
        extra: employee.extra + Number(amount),
      });
    }
  };

  const handleAddExpense = () => {
    const amount = prompt("مبلغ الدفعة؟");
    if (!amount) return;
    if (!expense) {
      setExpense({
        amount: Number(amount),
        description: "دفعة عمال",
        employees: true,
        employeeId: employee?.id,
      });
    } else {
      setExpense({
        ...expense,
        amount: expense.amount + Number(amount),
      });
    }
    if (employee) {
      setEmployee({
        ...employee,
        //paymentUnits: Number(
        //employee.paymentUnits -
        //    Math.floor(Number(amount) / employee.paymentAmount),
        //),
        balance: employee.balance + Number(amount),
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (expense) {
        const postedExpense = await apiInstance.post(expensesEndPoint, expense);
        console.log(postedExpense);
      }
      const updatedEmployee = await apiInstance.put(
        employeesEndPoint,
        employee,
      );
      console.log(updatedEmployee);
      setExpense(undefined);
      dispatch(fetchEmployees());
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
      const result = Number(
        employee.paymentAmount * employee.paymentUnits + employee.extra,
      );
      return result;
    }
    return 0;
  };
  const calculateBalance = () => {
    if (employee) return calculateAmount() - employee.balance;
    else return 0;
  };

  return (
    <>
      {(!employee || status === "loading") && <Spinner />}
      <table
        className={`min-w-full border-s-slate-950 border-2 ${extraClasses}`}
      >
        <thead>
          <tr className="bg-blue-200">
            <td className="p-4 ">المعرف</td>
            <td className="p-4">القيمة</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">الية الحساب</td>
            <td className="border-s-slate-950 border-2 p-2">{method2}</td>
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
                <p>عدد {method2} (الدوام)</p>
              </div>
            </td>
            <td className="border-s-slate-950 border-2 p-2">
              {employee?.paymentUnits}
            </td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">
              <div className="flex space-x-2">
                <p>اضافي (سعر ساعات عمل اضافية او مدخولات اخرى)</p>
              </div>
            </td>
            <td className="border-s-slate-950 p-2 flex">
              ₪ {employee?.extra}
              {employee && (
                <p className="text-red-600 px-3 space-x-3">
                  أي ما يعادل
                  {" " +
                    Number(employee?.extra / employee?.paymentAmount).toFixed(
                      2,
                    ) +
                    " "}
                  {method1}
                </p>
              )}
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
          اضافة {method1}
        </DefaultButton>
        <DefaultButton onButtonClick={handleAddDays}>
          اضافة {method2}
        </DefaultButton>
        <DefaultButton onButtonClick={handleAddExtra}>
          اضافة مدخولات اضافية
        </DefaultButton>
        <DefaultButton onButtonClick={handleAddExpense}>
          تسجيل دفعة
        </DefaultButton>

        <SafeButton onButtonClick={() => setReset(!reset)}>
          التراجع عن جميع الحركات
        </SafeButton>
        <DangerButton onButtonClick={handleSubmit}>تأكيد و حفظ</DangerButton>
      </div>
    </>
  );
}

export default EmployeeStatement;
