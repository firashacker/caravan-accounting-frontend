import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import EmployeeStatement from "./Employee.Statement";
import EmployeeExpenses from "./Employee.Expenses";
import { Link } from "react-router-dom";
import { DefaultButtonStyle } from "../components/Button/Button.component";

function Employee() {
  const employeeId = Number(useParams().id);
  const employeeName = useParams().name;
  const page = useParams().page;

  return (
    <>
      <div className=" p-8 flex flex-col  space-x-4 fixed bg-blue-100 min-w-full border-b-2 border-black">
        <div className="flex pb-4 text-xl">
          <FontAwesomeIcon className="p-1" icon={faPerson} />
          <h1>{employeeName}</h1>
          <p className="px-2 text-sm">[ عامل ]</p>
        </div>
        <div className="p-4">
          <NavButtons
            employeeId={employeeId}
            employeeName={employeeName}
            page={page}
          />
        </div>
      </div>
      <div className="pt-50">
        <NavPage employeeId={employeeId} page={page} />
      </div>
    </>
  );
}

const NavPage = ({
  employeeId,
  page,
}: {
  employeeId: number;
  page: string | undefined;
}) => {
  switch (page) {
    case "statement":
      {
        return <EmployeeStatement employeeId={employeeId} />;
      }
      break;
    case "expenses":
      {
        return <EmployeeExpenses employeeId={employeeId} />;
      }
      break;
    default:
      return <></>;
      break;
  }
};

const NavButtons = ({
  employeeId,
  page,
  employeeName,
}: {
  employeeId: number;
  employeeName: string | undefined;
  page: string | undefined;
}) => {
  const endPoint = `/employees/${employeeId}/${employeeName}`;
  switch (page) {
    case "statement":
      {
        return (
          <div>
            <Link className={DefaultButtonStyle} to={`${endPoint}/expenses`}>
              عرض الدفع
            </Link>
          </div>
        );
      }
      break;
    case "expenses":
      {
        return (
          <div>
            <Link className={DefaultButtonStyle} to={`${endPoint}/statement`}>
              كشف الحساب
            </Link>
          </div>
        );
      }
      break;
  }
};

export default Employee;
