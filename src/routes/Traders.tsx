import { useSelector } from "react-redux";
import { type RootState } from "../state/store";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop, faUser } from "@fortawesome/free-solid-svg-icons";
import DefaultButton, {
  DefaultButtonStyle,
} from "../components/Button/Button.component";
import { faAdd } from "@fortawesome/free-solid-svg-icons/faAdd";
import { useEffect } from "react";
import { fetchTradersIfNeeded } from "../state/Traders/Traders.slice";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";

//const paymentMethods = { dayly: "يومي", weekly: "اسبوعي", monthly: "شهري" };

function Traders() {
  const { traderList, status } = useSelector(
    (state: RootState) => state.traders,
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTradersIfNeeded(traderList));
  }, []);
  return (
    <>
      {status === "loading" && <Spinner />}
      <div className="bg-slate-100 p-8 flex flex-col  space-x-4">
        <div className="flex pb-4 text-xl space-x-2">
          <h1>التجار</h1>
          <FontAwesomeIcon icon={faShop} />
        </div>
        <div>
          <Link to="/traders/new">
            <DefaultButton
              extraClasses="flex"
              onButtonClick={() => console.log("Fuck")}
            >
              <FontAwesomeIcon className="p-1" icon={faAdd} />
              <p>اضافة تاجر</p>
            </DefaultButton>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap">
        {traderList &&
          traderList.map((trader) => (
            <Link
              key={trader.id}
              className={`${DefaultButtonStyle} rounded-md m-4 w-full sm:w-50 sm:min-w-50 p-4 shdow-2xl`}
              to={`/traders/${trader.id}`}
            >
              <div className="min-w-full flex">
                <FontAwesomeIcon className="text-red-600" icon={faUser} />
                <p className="px-2">{trader.name}</p>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}

export default Traders;
