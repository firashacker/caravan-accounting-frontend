import { useSelector } from "react-redux";
import { type RootState } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type EmployeeType } from "../state/Employees/Employees.slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPerson } from "@fortawesome/free-solid-svg-icons";

function Employee() {
  const { employeeList, status } = useSelector(
    (state: RootState) => state.employees,
  );
  const employeeId = useParams().id;
  const [employee, setEmployee] = useState<EmployeeType>();

  useEffect(() => {
    const result = employeeList.find((e) => e.id === Number(employeeId));
    setEmployee(result);
  }, [employeeId]);

  return (
    <>
      {status === "loading" && <Spinner />}

      <div className=" p-8 flex flex-col  space-x-4">
        <div className="flex pb-4 text-xl">
          <FontAwesomeIcon className="p-1" icon={faPerson} />
          <h1>{employee?.name}</h1>
          <p className="px-2 text-sm">[عامل]</p>
        </div>
      </div>
      <div></div>
    </>
  );
}

export default Employee;
