import { useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";
import { useEffect, useState } from "react";
import DefaultButton, {
  DangerButton,
  SafeButton,
} from "../components/Button/Button.component";
import {
  expensesEndPoint,
  fetchExpenseSum,
  appendExpense,
} from "../state/Expenses/Expenses.slice";
import { useDispatch } from "react-redux";
import { type ExpenseType } from "../state/Expenses/Expenses.slice";
import apiInstance from "../lib/axios";

interface InvestorStatementOptions {
  extraClasses?: string;
  investorId: number;
}
function InvestorStatement({ investorId }: InvestorStatementOptions) {
  const [loading, setLoading] = useState(true);
  const { expenseSum } = useSelector((state: RootState) => state.expense);
  const dispatch = useDispatch<AppDispatch>();
  const [refetch, setRefetch] = useState(false);
  const [overAll, setOverAll] = useState(0);
  const [newExpenses, setNewExpenses] = useState<ExpenseType[]>([]);
  const [expenses, setExpenses] = useState(0);

  const handleAddExpense = () => {
    const amount = Number(prompt("مبلغ المسحوبات ؟"));
    if (isNaN(amount)) return alert("المدخل ليس رقماً !");
    const decription = prompt("الوصف ؟") || "مسحوبات مستثمرين";
    const newExpense: ExpenseType = {
      amount: amount,
      description: decription,
      investorId: investorId,
    };
    setNewExpenses([...newExpenses, newExpense]);
    setExpenses(expenses + amount);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (newExpenses.length > 0) {
      await newExpenses.map(async (expense) => {
        try {
          const response = await apiInstance.post(expensesEndPoint, expense);
          dispatch(appendExpense(response.data));
        } catch (error) {
          console.log(error);
          alert(
            "حدث خطأ اثناء تسجيل الدفع الرجاء التأكد من صحة الحسابات واعادة العمليات المطلوبة",
          );
        }
      });
    }
    console.log("posted!");
    setTimeout(() => {
      setRefetch(!refetch);
      console.log("refetching!");
    }, 500);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(fetchExpenseSum({ section: "investor", id: String(investorId) }));
    setExpenses(0);
    setNewExpenses([]);
    setLoading(false);
  }, [investorId, refetch]);

  useEffect(() => {
    const allExpenses = expenseSum + expenses;
    setOverAll(allExpenses);
  }, [expenseSum, expenses]);

  return (
    <>
      {loading && <Spinner />}

      <table className="min-w-full border-s-slate-950 border-2">
        <thead>
          <tr className="bg-blue-200">
            <td className="p-4 ">المعرف</td>
            <td className="p-4">القيمة</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">مجموع المصاريف</td>
            <td className="border-s-slate-950 border-2 p-2">
              {expenseSum + expenses}
            </td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">المحصلة</td>
            <td className="border-s-slate-950 border-2 p-2">
              <div className="flex space-x-4">
                <p> ₪ {Math.abs(overAll)}</p>
                <p className="text-red-500">{overAll < 0 ? "له" : "عليه"}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="p-8 space-x-2">
        <DefaultButton onButtonClick={handleAddExpense}>
          تسجيل مصاريف
        </DefaultButton>
        <SafeButton onButtonClick={() => setRefetch(!refetch)}>
          التراجع عن جميع الحركات
        </SafeButton>
        <DangerButton onButtonClick={handleSubmit}>تأكيد و حفظ</DangerButton>
      </div>
    </>
  );
}

export default InvestorStatement;
