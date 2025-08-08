import { useSelector, useDispatch } from "react-redux";
import { type AppDispatch, type RootState } from "../state/store";
//import { fetchEmployeeExpenseSum } from "../state/Expenses/Expenses.slice";
import { fetchDebits } from "../state/Debits/Debits.slice";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner/Spinner.component";
import DefaultButton from "../components/Button/Button.component";

interface ClientDebitsOptions {
  extraClasses?: string;
  clientId: number;
}
const ClientDebits = ({ clientId, extraClasses }: ClientDebitsOptions) => {
  const dispatch = useDispatch<AppDispatch>();
  const { debitList, status } = useSelector((state: RootState) => state.debit);

  const [newPage, setNewpage] = useState(0);

  useEffect(() => {
    dispatch(
      fetchDebits({
        from: debitList.length,
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
          {debitList &&
            debitList.map((debit) => (
              <tr key={debit.id}>
                <td className="border-s-slate-950 border-2 p-2">
                  {debit.createdAt?.split("T")[0]}
                </td>
                <td className="border-s-slate-950 border-2 p-2">
                  {debit.amount}
                </td>
                <td className="border-s-slate-950 border-2 p-2">
                  {debit.description}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="p-8 space-x-2">
        {debitList.length > newPage && (
          <DefaultButton onButtonClick={() => setNewpage(debitList.length)}>
            تحميل المزيد
          </DefaultButton>
        )}
      </div>
    </>
  );
};

export default ClientDebits;
