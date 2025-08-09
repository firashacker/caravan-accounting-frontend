import { useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";
import { useEffect, useState } from "react";
import DefaultButton, {
  DangerButton,
  SafeButton,
} from "../components/Button/Button.component";
import {
  incomesEndPoint,
  fetchIncomeSum,
  appendIncome,
} from "../state/Incomes/Incomes.slice";
import { useDispatch } from "react-redux";
import {
  appendDebit,
  debitsEndPoint,
  fetchDebitSum,
} from "../state/Debits/Debits.slice";
import apiInstance from "../lib/axios";
import type { IncomeType } from "../state/Incomes/Incomes.slice";
import type { DebitType } from "../state/Debits/Debits.slice";

interface ClientStatementOptions {
  extraClasses?: string;
  clientId: number;
}
function ClientStatement({ clientId }: ClientStatementOptions) {
  const [loading, setLoading] = useState(true);
  const { incomeSum } = useSelector((state: RootState) => state.income);
  const { debitSum } = useSelector((state: RootState) => state.debit);
  const dispatch = useDispatch<AppDispatch>();
  const [refetch, setRefetch] = useState(false);
  const [overAll, setOverAll] = useState(0);
  const [newIncomes, setNewIncomes] = useState<IncomeType[]>([]);
  const [newDebits, setNewDebits] = useState<DebitType[]>([]);
  const [debits, setDebits] = useState(0);
  const [incomes, setIncomes] = useState(0);

  const handleAddIncome = () => {
    const amount = Number(prompt("مبلغ الدفعة ؟"));
    if (isNaN(amount)) return alert("المدخل ليس رقماً !");
    const decription = prompt("الوصف ؟") || "دفعة عميل";
    const newIncome: IncomeType = {
      amount: amount,
      description: decription,
      clientId: clientId,
    };
    setNewIncomes([...newIncomes, newIncome]);
    setIncomes(incomes + amount);
  };

  const handleAddDebit = () => {
    const amount = Number(prompt("مبلغ الفاتورة ؟"));
    if (isNaN(amount)) return alert("المدخل ليس رقماً !");
    const decription = prompt("الوصف ؟") || "فاتورة عميل";
    const newDebit: DebitType = {
      amount: amount,
      description: decription,
      clientId: clientId,
    };
    setNewDebits([...newDebits, newDebit]);
    setDebits(debits + amount);
  };

  const handleSubmit = async () => {
    if (newIncomes.length > 0) {
      newIncomes.map(async (expense) => {
        try {
          const response = await apiInstance.post(incomesEndPoint, expense);
          dispatch(appendIncome(response.data));
        } catch (error) {
          console.log(error);
          alert(
            "حدث خطأ اثناء تسجيل الدفع الرجاء التأكد من صحة الحسابات واعادة العمليات المطلوبة",
          );
        }
      });
    }
    if (newDebits.length > 0) {
      newDebits.map(async (debt) => {
        try {
          const response = await apiInstance.post(debitsEndPoint, debt);
          dispatch(appendDebit(response.data));
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
    dispatch(fetchIncomeSum({ section: "client", id: String(clientId) }));
    dispatch(fetchDebitSum({ section: "client", id: String(clientId) }));
    setDebits(0);
    setIncomes(0);
    setNewDebits([]);
    setNewIncomes([]);
    setLoading(false);
  }, [clientId, refetch]);

  useEffect(() => {
    const allDebts = debitSum + debits;
    const allExpenses = incomeSum + incomes;
    setOverAll(allDebts - allExpenses);
  }, [incomeSum, debitSum, debits, incomes]);

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
              {debitSum + debits}
            </td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">مجموع الدفعات</td>
            <td className="border-s-slate-950 border-2 p-2">
              {incomeSum + incomes}
            </td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">المحصلة</td>
            <td className="border-s-slate-950 border-2 p-2">
              <div className="flex space-x-4">
                <p> ₪ {Math.abs(overAll)}</p>
                <p className="text-red-500">{overAll <= 0 ? "له" : "عليه"}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="p-8 space-x-2">
        <DefaultButton onButtonClick={handleAddIncome}>
          تسجيل دفعة
        </DefaultButton>
        <DefaultButton onButtonClick={handleAddDebit}>
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

export default ClientStatement;
