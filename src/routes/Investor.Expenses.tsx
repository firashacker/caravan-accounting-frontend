import { useSelector, useDispatch } from "react-redux";
import { type AppDispatch, type RootState } from "../state/store";
//import { fetchEmployeeExpenseSum } from "../state/Expenses/Expenses.slice";

import { fetchExpenses } from "../state/Expenses/Expenses.slice";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner/Spinner.component";
import DefaultButton from "../components/Button/Button.component";

interface InvestorExpensesOptions {
  extraClasses?: string;
  investorId: number;
}
const InvestorExpenses = ({
  investorId,
  extraClasses,
}: InvestorExpensesOptions) => {
  const dispatch = useDispatch<AppDispatch>();
  const { expenseList, status } = useSelector(
    (state: RootState) => state.expense,
  );

  const [newPage, setNewpage] = useState(0);

  useEffect(() => {
    dispatch(
      fetchExpenses({
        from: expenseList.length,
        section: "investor",
        id: String(investorId),
      }),
    );
  }, [newPage]);

  return (
    <>
      {status === "loading" && <Spinner />}

      <table
        className={`min-w-full border-s-slate-950 border-2 ${extraClasses}`}
      >
        <thead>
          <tr className="bg-blue-200">
            <td className="p-4 ">الوقت</td>
            <td className="p-4">المبلغ</td>
            <td className="p-4">الوصف</td>
          </tr>
        </thead>
        <tbody>
          {expenseList &&
            expenseList.map((expense) => (
              <tr key={expense.id}>
                <td className="border-s-slate-950 border-2 p-2">
                  {expense.createdAt?.split("T")[0]}
                </td>
                <td className="border-s-slate-950 border-2 p-2">
                  {expense.amount}
                </td>
                <td className="border-s-slate-950 border-2 p-2">
                  {expense.description}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="p-8 space-x-2">
        {expenseList.length > newPage && (
          <DefaultButton onButtonClick={() => setNewpage(expenseList.length)}>
            تحميل المزيد
          </DefaultButton>
        )}
      </div>
    </>
  );
};

export default InvestorExpenses;
