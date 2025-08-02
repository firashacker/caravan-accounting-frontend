import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { type AppDispatch, type RootState } from "../state/store";
import { useEffect } from "react";
import { fetchEmployees } from "../state/Employees/Employees.slice";

function Employees() {
  const { employees } = useSelector((state: RootState) => state.Employees);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);
  return (
    <>
      <h1 className="bg-red-300 p-8">EMPLOYEES</h1>
      {employees &&
        employees.map((employee) => (
          <div key={employee.id}>{employee.name}</div>
        ))}
    </>
  );
}

export default Employees;
