import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { DefaultButtonStyle } from "../components/Button/Button.component";
import InvestorExpenses from "./Investor.Expenses";
import InvestorStatement from "./Investor.Statement";

function Investor() {
  const investorId = Number(useParams().id);
  const investorName = useParams().name;
  const page = useParams().page;

  return (
    <>
      <div className=" p-8 flex flex-col  space-x-4 fixed bg-blue-100 min-w-full border-b-2 border-black">
        <div className="flex pb-4 text-xl">
          <FontAwesomeIcon className="p-1" icon={faPerson} />
          <h1>{investorName}</h1>
          <p className="px-2 text-sm">[ مستثمر ]</p>
        </div>
        <div className="p-4">
          <NavButtons
            investorId={investorId}
            investorName={investorName}
            page={page}
          />
        </div>
      </div>
      <div className="pt-50">
        <NavPage investorId={investorId} page={page} />
      </div>
    </>
  );
}

const NavPage = ({
  investorId,
  page,
}: {
  investorId: number;
  page: string | undefined;
}) => {
  switch (page) {
    case "statement":
      {
        return <InvestorStatement investorId={investorId} />;
      }
      break;
    case "expenses":
      {
        return <InvestorExpenses investorId={investorId} />;
      }
      break;
    default:
      return <></>;
      break;
  }
};

const NavButtons = ({
  investorId,
  page,
  investorName,
}: {
  investorId: number;
  investorName: string | undefined;
  page: string | undefined;
}) => {
  const endPoint = `/investors/${investorId}/${investorName}`;
  switch (page) {
    case "statement":
      {
        return (
          <div>
            <Link className={DefaultButtonStyle} to={`${endPoint}/expenses`}>
              عرض المصروفات
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

export default Investor;
