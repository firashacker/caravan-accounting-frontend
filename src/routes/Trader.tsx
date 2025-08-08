import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { DefaultButtonStyle } from "../components/Button/Button.component";
import TraderStatement from "./Trader.Statement";
import TraderExpenses from "./Trader.Expenses";
import TraderDebts from "./Trader.Debts";

function Trader() {
  const traderId = Number(useParams().id);
  const traderName = useParams().name;
  const page = useParams().page;

  return (
    <>
      <div className=" p-8 flex flex-col  space-x-4 fixed bg-blue-100 min-w-full border-b-2 border-black">
        <div className="flex pb-4 text-xl">
          <FontAwesomeIcon className="p-1" icon={faPerson} />
          <h1>{traderName}</h1>
          <p className="px-2 text-sm">[ تاجر ]</p>
        </div>
        <div className="pt-4">
          <NavButtons traderId={traderId} traderName={traderName} page={page} />
        </div>
      </div>
      <div className="pt-45">
        <NavPage traderId={traderId} page={page} />
      </div>
    </>
  );
}

const NavPage = ({
  traderId,
  page,
}: {
  traderId: number;
  page: string | undefined;
}) => {
  switch (page) {
    case "statement":
      {
        return <TraderStatement traderId={traderId} />;
      }
      break;
    case "expenses":
      {
        return <TraderExpenses traderId={traderId} />;
      }
      break;
    case "debts":
      {
        return <TraderDebts traderId={traderId} />;
      }
      break;
    default:
      return <></>;
      break;
  }
};

const NavButtons = ({
  traderId,
  page,
  traderName,
}: {
  traderId: number;
  traderName: string | undefined;
  page: string | undefined;
}) => {
  switch (page) {
    case "statement":
      {
        return (
          <div>
            <Link
              className={DefaultButtonStyle}
              to={`/traders/${traderId}/${traderName}/expenses`}
            >
              عرض الدفع
            </Link>
            <Link
              className={DefaultButtonStyle}
              to={`/traders/${traderId}/${traderName}/debts`}
            >
              عرض الفواتير
            </Link>
          </div>
        );
      }
      break;
    case "expenses":
      {
        return (
          <div>
            <Link
              className={DefaultButtonStyle}
              to={`/traders/${traderId}/${traderName}/statement`}
            >
              عرض كشف الحساب
            </Link>
            <Link
              className={DefaultButtonStyle}
              to={`/traders/${traderId}/${traderName}/debts`}
            >
              عرض الفواتير
            </Link>
          </div>
        );
      }
      break;
    case "debts":
      {
        return (
          <div>
            <Link
              className={DefaultButtonStyle}
              to={`/traders/${traderId}/${traderName}/statement`}
            >
              عرض كشف الحساب
            </Link>
            <Link
              className={DefaultButtonStyle}
              to={`/traders/${traderId}/${traderName}/expenses`}
            >
              عرض الدفع
            </Link>
          </div>
        );
      }
      break;
  }
};

export default Trader;
