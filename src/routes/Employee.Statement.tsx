import { useSelector } from "react-redux";
import { type RootState } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";
import {
  appendDebt,
  debtsEndPoint,
  fetchDebtSum,
  type DebtType,
} from "../state/Debts/Debts.slice";
import { fetchExpenseSum } from "../state/Expenses/Expenses.slice";
import { useEffect, useState } from "react";
import { type EmployeeType } from "../state/Employees/Employees.slice";
import {
  appendExpense,
  expensesEndPoint,
  type ExpenseType,
} from "../state/Expenses/Expenses.slice";

import { useDispatch } from "react-redux";
import { type AppDispatch } from "../state/store";

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

//Fix this to play well with new debt changes
function EmployeeStatement({
  employeeId,
  extraClasses,
}: EmployeeStatementOptions) {
  const { status: debtStatus, debtSum } = useSelector(
    (state: RootState) => state.debt,
  );
  const { status: expenseStatus, expenseSum } = useSelector(
    (state: RootState) => state.expense,
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [result, setResult] = useState(0);
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [debts, setDebts] = useState<DebtType[]>([]);
  const [debtsAmount, setDebtsAmount] = useState(0);
  const [expensesAmount, setExpensesAmount] = useState(0);
  const [employee, setEmployee] = useState<EmployeeType>();
  const [method1, setMethod1] = useState("");
  const [method2, setMethod2] = useState("");
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    if (debtStatus === "loading" || expenseStatus === "loading")
      setLoading(true);
    else setLoading(false);
  }, [debtStatus, expenseStatus]);

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

    dispatch(fetchDebtSum({ id: String(employeeId), section: "employee" }));

    dispatch(fetchExpenseSum({ id: String(employeeId), section: "employee" }));

    setExpenses([]);
    setDebts([]);
    setDebtsAmount(debtSum);
    setExpensesAmount(expenseSum);
    setLoading(false);
  }, [employeeId, refetch]);

  useEffect(() => {
    setDebtsAmount(debtSum);
  }, [debtSum]);
  useEffect(() => {
    setExpensesAmount(expenseSum);
  }, [expenseSum]);

  const handleAddDay = () => {
    const amount = Number(employee?.paymentAmount);
    setDebts([
      ...debts,
      {
        amount: amount,
        description: "يوم عمل",
        employeeId: Number(employeeId),
      },
    ]);
    setDebtsAmount(debtsAmount + amount);
  };

  const handleAddDays = () => {
    const days = Number(prompt(`عدد ال${method2}`));
    if (isNaN(days)) return alert("المدخل ليس رقماً !");
    if (!days) return;
    if (employee) {
      const amount = Number(Number(days) * employee.paymentAmount);
      setDebts([
        ...debts,
        {
          amount: amount,
          description: `${days} ${method2} دوام`,
          employeeId: Number(employeeId),
        },
      ]);
      setDebtsAmount(debtsAmount + amount);
    }
  };

  const handleAddExtra = () => {
    const amount = Number(prompt("قيمة الدخل نقدأ"));
    if (isNaN(amount)) return alert("المدخل ليس رقماً !");
    const description = prompt("الوصف");
    if (!amount) return;
    setDebts([
      ...debts,
      {
        amount: amount,
        description: String(description),
        employeeId: Number(employeeId),
      },
    ]);
    setDebtsAmount(debtsAmount + amount);
  };

  const handleAddExpense = () => {
    const amount = Number(prompt("مبلغ الدفعة؟"));
    if (isNaN(amount)) return alert("المدخل ليس رقماً !");
    if (!amount) return;
    const description = prompt("الوصف");
    setExpenses([
      ...expenses,
      {
        amount: amount,
        description: description || "دفعة عمال",
        employeeId: Number(employeeId),
      },
    ]);
    setExpensesAmount(expensesAmount + amount);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (expenses.length > 0) {
      await expenses.map(async (expense) => {
        try {
          const response = await apiInstance.post(expensesEndPoint, expense);
          //console.log(response.data);
          dispatch(appendExpense(response.data));
        } catch (error) {
          console.log(error);
          alert(
            "حدث خطأ اثناء تسجيل الدفع الرجاء التأكد من صحة الحسابات واعادة العمليات المطلوبة",
          );
        }
      });
    }
    if (debts.length > 0) {
      await debts.map(async (debt) => {
        try {
          const response = await apiInstance.post(debtsEndPoint, debt);
          //console.log(response.data);
          dispatch(appendDebt(response.data));
        } catch (error) {
          console.log(error);
          alert(
            "حدث خطأ اثناء تسجيل الدوام الرجاء التأكد من صحة الحسابات واعادة العمليات المطلوبة",
          );
        }
      });
    }

    console.log("posted!");
    setTimeout(() => {
      setRefetch(!refetch);
      console.log("refetching !");
    }, 500);
  };

  const resolveMethods1 = () => {
    if (employee) return paymentMethods1[employee.paymentMethod];
    else return "";
  };
  const resolveMethods2 = () => {
    if (employee) return paymentMethods2[employee.paymentMethod];
    else return "";
  };

  useEffect(() => {
    setResult(debtsAmount - expensesAmount);
  }, [debtsAmount, expensesAmount]);

  return (
    <>
      {(!employee || loading) && <Spinner />}
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
              <p>الرصيد</p>
            </td>
            <td className="border-s-slate-950 border-2 p-2">
              <div className="flex space-x-4">
                <p> {debtsAmount}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">
              <p>المدفوع</p>
            </td>
            <td className="border-s-slate-950 border-2 p-2">
              <div className="flex space-x-4">
                <p> ₪ {expensesAmount}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">
              <p>المحصلة</p>
            </td>
            <td className="border-s-slate-950 border-2 p-2 bg-green-200">
              <div className="flex space-x-4">
                <p> ₪ {Math.abs(result)}</p>
                <p className="text-red-500">{result >= 0 ? "له" : "عليه"}</p>
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

        <SafeButton onButtonClick={() => setRefetch(!refetch)}>
          التراجع عن جميع الحركات
        </SafeButton>
        <DangerButton onButtonClick={handleSubmit}>تأكيد و حفظ</DangerButton>
      </div>
    </>
  );
}

export default EmployeeStatement;
