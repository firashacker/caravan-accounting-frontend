import { useSelector } from "react-redux";
import { type RootState } from "../state/store";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheck, faUser } from "@fortawesome/free-solid-svg-icons";
import { DefaultButtonStyle } from "../components/Button/Button.component";
import { faAdd } from "@fortawesome/free-solid-svg-icons/faAdd";
import { useEffect } from "react";
import { fetchInvestorsIfNeeded } from "../state/Investors/Investors.slice";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";

//const paymentMethods = { dayly: "يومي", weekly: "اسبوعي", monthly: "شهري" };

function Investors() {
  const { investorList, status } = useSelector(
    (state: RootState) => state.investors,
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchInvestorsIfNeeded());
  }, []);
  return (
    <>
      {status === "loading" && <Spinner />}
      <div className="bg-slate-100 p-8 flex flex-col  space-x-4">
        <div className="flex pb-4 text-xl space-x-2">
          <h1>المستثمرين</h1>
          <FontAwesomeIcon icon={faMoneyCheck} />
        </div>
        <div>
          <Link
            className={`${DefaultButtonStyle} flex w-fit`}
            to="/investors/new"
          >
            <FontAwesomeIcon className="p-1" icon={faAdd} />
            <p>اضافة مستثمر</p>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap">
        {investorList &&
          investorList.map((investor) => (
            <Link
              key={investor.id}
              className={`${DefaultButtonStyle} rounded-md m-4 w-full sm:w-50 sm:min-w-50 p-4 shdow-2xl`}
              to={`/investors/${investor.id}/${investor.name}/statement`}
            >
              <div className="min-w-full flex">
                <FontAwesomeIcon className="text-red-600" icon={faUser} />
                <p className="px-2">{investor.name}</p>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}

export default Investors;
