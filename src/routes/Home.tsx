import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "../components/Spinner/Spinner.component";
import { faCalculator } from "@fortawesome/free-solid-svg-icons/faCalculator";
import { useEffect, useState } from "react";
import apiInstance from "../lib/axios";
import { DefaultButtonStyle } from "../components/Button/Button.component";
import { Link } from "react-router-dom";
import { faAdd } from "@fortawesome/free-solid-svg-icons/faAdd";

function Home() {
  const [traderExpense, setTraderExpense] = useState(0);
  const [traderDebt, setTraderDebt] = useState(0);
  const [netTraderDebt, setNetTradeDebt] = useState(0);

  const [employeeExpense, setEmployeeExpense] = useState(0);
  const [employeeDebt, setEmployeeDebt] = useState(0);
  const [netEmployeeDebt, setNetEmployeeDebt] = useState(0);

  const [clientIncome, setClientIncome] = useState(0);
  const [clientDebit, setClientDebit] = useState(0);
  const [netClientDebit, setNetClientDebit] = useState(0);

  const [investorExpense, setInvestorExpense] = useState(0);

  const [workExpense, setWorkExpense] = useState(0);

  const [debt, setDebt] = useState(0);
  const [debit, setDebit] = useState(0);
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTraderDebt = async () => {
      setLoading(true);
      const response = await apiInstance.get("/api/debt/trader/all/sum");
      setTraderDebt(response.data.amount);
      setLoading(false);
    };
    getTraderDebt();

    const getEmployeeDebt = async () => {
      setLoading(true);

      const response = await apiInstance.get("/api/debt/employee/all/sum");
      setEmployeeDebt(response.data.amount);
      setLoading(false);
    };
    getEmployeeDebt();

    const getTraderExpense = async () => {
      setLoading(true);

      const response = await apiInstance.get("/api/expense/trader/all/sum");
      setTraderExpense(response.data.amount);
      setLoading(false);
    };
    getTraderExpense();

    const getEmployeeExpense = async () => {
      setLoading(true);

      const response = await apiInstance.get("/api/expense/employee/all/sum");
      setEmployeeExpense(response.data.amount);
      setLoading(false);
    };
    getEmployeeExpense();

    const getWorkExpense = async () => {
      setLoading(true);

      const response = await apiInstance.get("/api/expense/work/all/sum");
      setWorkExpense(response.data.amount);
      setLoading(false);
    };
    getWorkExpense();

    const getInvestorExpense = async () => {
      setLoading(true);

      const response = await apiInstance.get("/api/expense/investor/all/sum");
      setInvestorExpense(response.data.amount);
      setLoading(false);
    };
    getInvestorExpense();

    const getClientDebit = async () => {
      setLoading(true);

      const response = await apiInstance.get("/api/debit/client/all/sum");
      setClientDebit(response.data.amount);
      setLoading(false);
    };
    getClientDebit();

    const getClientIncome = async () => {
      setLoading(true);

      const response = await apiInstance.get("/api/income/client/all/sum");
      setClientIncome(response.data.amount);
      setLoading(false);
    };
    getClientIncome();
  }, []);

  useEffect(() => {
    setNetTradeDebt(traderDebt - traderExpense);
  }, [traderDebt, traderExpense]);

  useEffect(() => {
    setNetEmployeeDebt(employeeDebt - employeeExpense);
  }, [employeeDebt, employeeExpense]);

  useEffect(() => {
    setDebt(netTraderDebt + netEmployeeDebt);
  }, [netEmployeeDebt, netTraderDebt]);

  useEffect(() => {
    setExpense(employeeExpense + traderExpense + investorExpense + workExpense);
  }, [employeeExpense, traderExpense, investorExpense, workExpense]);

  useEffect(() => {
    setNetClientDebit(clientDebit - clientIncome);
  }, [clientDebit, clientIncome]);
  useEffect(() => {
    setDebit(netClientDebit);
  }, [netClientDebit]);

  useEffect(() => {
    setIncome(clientIncome);
  }, [clientIncome]);

  const plateStyle = `${DefaultButtonStyle} min-w-80 h-80 p-5 flex flex-col m-5 rounded-sm`;

  return (
    <>
      {loading && <Spinner />}
      <div className="bg-slate-100 p-8 flex flex-col  space-x-4">
        <div className="flex pb-4 text-xl space-x-2">
          <h1>الاحصائيات</h1>
          <FontAwesomeIcon icon={faCalculator} />
        </div>
        <div>
          <Link
            className={`${DefaultButtonStyle} flex w-fit`}
            to="/expense/new"
          >
            <FontAwesomeIcon className="p-1" icon={faAdd} />
            <p>اضافة مصاريف عمل</p>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap justify-center   p-10">
        <div className={plateStyle}>
          <div className="flex justify-center">
            <h1 className="p-3">الديون</h1>
          </div>
          <div className="flex justify-center">
            <table className={`min-w-full border-s-slate-950 border-2 `}>
              <tbody>
                <tr key={1}>
                  <td className="border-s-slate-950 border-2 p-2">التجار</td>
                  <td className="border-s-slate-950 border-2 p-2">
                    {netTraderDebt}
                  </td>
                </tr>
                <tr key={2}>
                  <td className="border-s-slate-950 border-2 p-2">العمال</td>
                  <td className="border-s-slate-950 border-2 p-2">
                    {netEmployeeDebt}
                  </td>
                </tr>
                <tr key={3}>
                  <td className="border-s-slate-950 border-2 p-2">المحصلة</td>
                  <td className="border-s-slate-950 border-2 p-2">{debt}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={plateStyle}>
          <div className="flex justify-center">
            <h1 className="p-3">المدينون</h1>
          </div>
          <div className="flex justify-center">
            <table className={`min-w-full border-s-slate-950 border-2 `}>
              <tbody>
                <tr key={1}>
                  <td className="border-s-slate-950 border-2 p-2">العملاء</td>
                  <td className="border-s-slate-950 border-2 p-2">
                    {netClientDebit}
                  </td>
                </tr>
                <tr key={3}>
                  <td className="border-s-slate-950 border-2 p-2">المحصلة</td>
                  <td className="border-s-slate-950 border-2 p-2">{debit}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={plateStyle}>
          <div className="flex justify-center">
            <h1 className="p-3">المصاريف</h1>
          </div>
          <div className="flex justify-center">
            <table className={`min-w-full border-s-slate-950 border-2 `}>
              <tbody>
                <tr key={1}>
                  <td className="border-s-slate-950 border-2 p-2">التجار</td>
                  <td className="border-s-slate-950 border-2 p-2">
                    {traderExpense}
                  </td>
                </tr>
                <tr key={2}>
                  <td className="border-s-slate-950 border-2 p-2">العمال</td>
                  <td className="border-s-slate-950 border-2 p-2">
                    {employeeExpense}
                  </td>
                </tr>
                <tr key={3}>
                  <td className="border-s-slate-950 border-2 p-2">
                    المستثمرين
                  </td>
                  <td className="border-s-slate-950 border-2 p-2">
                    {investorExpense}
                  </td>
                </tr>
                <tr key={4}>
                  <td className="border-s-slate-950 border-2 p-2">اخرى</td>
                  <td className="border-s-slate-950 border-2 p-2">
                    {workExpense}
                  </td>
                </tr>
                <tr key={5}>
                  <td className="border-s-slate-950 border-2 p-2">المحصلة</td>
                  <td className="border-s-slate-950 border-2 p-2">{expense}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={plateStyle}>
          <div className="flex justify-center">
            <h1 className="p-3">الدخل</h1>
          </div>
          <div className="flex justify-center">
            <table className={`min-w-full border-s-slate-950 border-2 `}>
              <tbody>
                <tr key={1}>
                  <td className="border-s-slate-950 border-2 p-2">العملاء</td>
                  <td className="border-s-slate-950 border-2 p-2">
                    {clientIncome}
                  </td>
                </tr>
                <tr key={3}>
                  <td className="border-s-slate-950 border-2 p-2">المحصلة</td>
                  <td className="border-s-slate-950 border-2 p-2">{income}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
