import { useSelector, useDispatch } from "react-redux";
import { type AppDispatch, type RootState } from "../state/store";
//import { fetchEmployeeExpenseSum } from "../state/Expenses/Expenses.slice";

import { fetchDebts } from "../state/Debts/Debts.slice";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner/Spinner.component";
import DefaultButton from "../components/Button/Button.component";

interface EmployeeDebtsOptions {
  extraClasses?: string;
  employeeId: number;
}
const EmployeeDebts = ({ employeeId, extraClasses }: EmployeeDebtsOptions) => {
  const dispatch = useDispatch<AppDispatch>();
  const { debtList, status } = useSelector((state: RootState) => state.debt);

  const [newPage, setNewpage] = useState(0);

  useEffect(() => {
    dispatch(
      fetchDebts({
        from: debtList.length,
        section: "employee",
        id: String(employeeId),
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
          {debtList &&
            debtList.map((debt) => (
              <tr key={debt.id}>
                <td className="border-s-slate-950 border-2 p-2">
                  {debt.createdAt?.split("T")[0]}
                </td>
                <td className="border-s-slate-950 border-2 p-2">
                  {debt.amount}
                </td>
                <td className="border-s-slate-950 border-2 p-2">
                  {debt.description}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="p-8 space-x-2">
        {debtList.length > newPage && (
          <DefaultButton onButtonClick={() => setNewpage(debtList.length)}>
            تحميل المزيد
          </DefaultButton>
        )}
      </div>
    </>
  );
};

export default EmployeeDebts;
