import { useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";
import { useEffect, useState } from "react";
import DefaultButton, {
  DangerButton,
  SafeButton,
} from "../components/Button/Button.component";
import { fetchExpenseSum } from "../state/Expenses/Expenses.slice";
import { useDispatch } from "react-redux";
import { fetchDebtSum } from "../state/Debts/Debts.slice";

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

  useEffect(() => {
    setLoading(true);
    dispatch(fetchExpenseSum({ section: "trader", id: String(traderId) }));
    dispatch(fetchDebtSum({ section: "trader", id: String(traderId) }));
    setLoading(false);
  }, [traderId, refetch]);

  useEffect(() => {
    setOverAll(debtSum - expenseSum);
  }, [expenseSum, debtSum]);

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
            <td className="border-s-slate-950 border-2 p-2">{debtSum}</td>
          </tr>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">مجموع الدفعات</td>
            <td className="border-s-slate-950 border-2 p-2">{expenseSum}</td>
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
        <DefaultButton>تسجيل دفعة</DefaultButton>
        <SafeButton onButtonClick={() => setRefetch(!refetch)}>
          التراجع عن جميع الحركات
        </SafeButton>
        <DangerButton>تأكيد و حفظ</DangerButton>
      </div>
    </>
  );
}

export default TraderStatement;
