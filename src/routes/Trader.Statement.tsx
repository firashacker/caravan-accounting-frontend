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
} from "../state/Expenses/Expenses.slice";
import { useDispatch } from "react-redux";
import { debtsEndPoint, fetchDebtSum } from "../state/Debts/Debts.slice";
import { type ExpenseType } from "../state/Expenses/Expenses.slice";
import { type DebtType } from "../state/Debts/Debts.slice";
import apiInstance from "../lib/axios";

interface TraderStatementOptions {
  extraClasses?: string;
  traderId: number;
}
function TraderStatement({ traderId }: TraderStatementOptions) {
  const [loading, setLoading] = useState(true);
  const { expenseSum } = useSelector((state: RootState) => state.expense);
  const { debtSum } = useSelector((state: RootState) => state.debt);
  const dispatch = useDispatch<AppDispatch>();
  const [refetch, setRefetch] = useState(false);
  const [overAll, setOverAll] = useState(0);
  const [newExpenses, setNewExpenses] = useState<ExpenseType[]>([]);
  const [newDebts, setNewDebts] = useState<DebtType[]>([]);
  const [debts, setDebts] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const handleAddExpense = () => {
    const amount = Number(prompt("مبلغ الدفعة ؟"));
    if (isNaN(amount)) return alert("المدخل ليس رقماً !");
    const decription = prompt("الوصف ؟") || "دفعة تاجر";
    const newExpense: ExpenseType = {
      amount: amount,
      description: decription,
      traderId: traderId,
    };
    setNewExpenses([...newExpenses, newExpense]);
    setExpenses(expenses + amount);
  };

  const handleAddDebt = () => {
    const amount = Number(prompt("مبلغ الفاتورة ؟"));
    if (isNaN(amount)) return alert("المدخل ليس رقماً !");
    const decription = prompt("الوصف ؟") || "فاتورة تاجر";
    const newDebt: DebtType = {
      amount: amount,
      description: decription,
      traderId: traderId,
    };
    setNewDebts([...newDebts, newDebt]);
    setDebts(debts + amount);
  };

  const handleSubmit = async () => {
    if (newExpenses.length > 0) {
      newExpenses.map(async (expense) => {
        try {
          const response = await apiInstance.post(expensesEndPoint, expense);
          console.log(response);
        } catch (error) {
          console.log(error);
          alert(
            "حدث خطأ اثناء تسجيل الدفع الرجاء التأكد من صحة الحسابات واعادة العمليات المطلوبة",
          );
        }
      });
    }
    if (newDebts.length > 0) {
      newDebts.map(async (debt) => {
        try {
          const response = await apiInstance.post(debtsEndPoint, debt);
          console.log(response);
        } catch (error) {
          console.log(error);
          alert(
            "حدث خطأ اثناء تسجيل الفواتير الرجاء التأكد من صحة الحسابات واعادة العمليات المطلوبة",
          );
        }
      });
    }
    setRefetch(!refetch);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(fetchExpenseSum({ section: "trader", id: String(traderId) }));
    dispatch(fetchDebtSum({ section: "trader", id: String(traderId) }));
    setDebts(0);
    setExpenses(0);
    setNewDebts([]);
    setNewExpenses([]);
    setLoading(false);
  }, [traderId, refetch]);

  useEffect(() => {
    const allDebts = debtSum + debts;
    const allExpenses = expenseSum + expenses;
    setOverAll(allDebts - allExpenses);
  }, [expenseSum, debtSum, debts, expenses]);

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
            <td className="border-s-slate-950 border-2 p-2">مجموع الفواتير</td>
            <td className="border-s-slate-950 border-2 p-2">
              {debtSum + debts}
            </td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">مجموع الدفعات</td>
            <td className="border-s-slate-950 border-2 p-2">
              {expenseSum + expenses}
            </td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">المحصلة</td>
            <td className="border-s-slate-950 border-2 p-2">
              <div className="flex space-x-4">
                <p> ₪ {Math.abs(overAll)}</p>
                <p className="text-red-500">{overAll >= 0 ? "له" : "عليه"}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="p-8 space-x-2">
        <DefaultButton onButtonClick={handleAddExpense}>
          تسجيل دفعة
        </DefaultButton>
        <DefaultButton onButtonClick={handleAddDebt}>
          تسجيل فاتورة
        </DefaultButton>
        <SafeButton onButtonClick={() => setRefetch(!refetch)}>
          التراجع عن جميع الحركات
        </SafeButton>
        <DangerButton onButtonClick={handleSubmit}>تأكيد و حفظ</DangerButton>
      </div>
    </>
  );
}

export default TraderStatement;
