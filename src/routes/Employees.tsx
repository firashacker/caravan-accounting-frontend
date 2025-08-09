import { useSelector } from "react-redux";
import { type RootState } from "../state/store";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHammer } from "@fortawesome/free-solid-svg-icons/faHammer";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { DefaultButtonStyle } from "../components/Button/Button.component";
import { faAdd } from "@fortawesome/free-solid-svg-icons/faAdd";
import { useEffect } from "react";
import { fetchEmployeesIfNeeded } from "../state/Employees/Employees.slice";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";

const paymentMethods = { dayly: "يومي", weekly: "اسبوعي", monthly: "شهري" };

function Employees() {
  const { employeeList, status } = useSelector(
    (state: RootState) => state.employees,
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchEmployeesIfNeeded());
  }, []);
  return (
    <>
      {status === "loading" && <Spinner />}
      <div className="bg-slate-100 p-8 flex flex-col  space-x-4">
        <div className="flex pb-4 text-xl">
          <h1>العمال</h1>
          <FontAwesomeIcon icon={faHammer} />
        </div>
        <div>
          <Link
            className={`${DefaultButtonStyle} flex w-fit`}
            to="/employees/new"
          >
            <FontAwesomeIcon className="p-1" icon={faAdd} />
            <p>اضافة عامل</p>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap">
        {employeeList &&
          employeeList.map((employee) => (
            <Link
              key={employee.id}
              className={`${DefaultButtonStyle} rounded-md m-4 w-full sm:w-fit min-w-60 p-4 shdow-2xl`}
              to={`/employees/${employee.id}/${employee.name}/statement`}
            >
              <div className="min-w-full flex">
                <FontAwesomeIcon className="text-red-600" icon={faUser} />
                <p className="px-2 text-wrap break-words">{employee.name}</p>
                <p className="text-xs">
                  [{paymentMethods[employee.paymentMethod]}]
                </p>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}

export default Employees;
