import { useSelector, useDispatch } from "react-redux";
import { type AppDispatch, type RootState } from "../state/store";
//import { fetchEmployeeExpenseSum } from "../state/Expenses/Expenses.slice";

import { fetchIncomes } from "../state/Incomes/Incomes.slice";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner/Spinner.component";
import DefaultButton from "../components/Button/Button.component";

interface ClientIncomesOptions {
  extraClasses?: string;
  clientId: number;
}
const ClientIncomes = ({ clientId, extraClasses }: ClientIncomesOptions) => {
  const dispatch = useDispatch<AppDispatch>();
  const { incomeList, status } = useSelector(
    (state: RootState) => state.income,
  );

  const [newPage, setNewpage] = useState(0);

  useEffect(() => {
    dispatch(
      fetchIncomes({
        from: incomeList.length,
        section: "client",
        id: String(clientId),
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
          {incomeList &&
            incomeList.map((income) => (
              <tr key={income.id}>
                <td className="border-s-slate-950 border-2 p-2">
                  {income.createdAt?.split("T")[0]}
                </td>
                <td className="border-s-slate-950 border-2 p-2">
                  {income.amount}
                </td>
                <td className="border-s-slate-950 border-2 p-2">
                  {income.description}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="p-8 space-x-2">
        {incomeList.length > newPage && (
          <DefaultButton onButtonClick={() => setNewpage(incomeList.length)}>
            تحميل المزيد
          </DefaultButton>
        )}
      </div>
    </>
  );
};

export default ClientIncomes;
