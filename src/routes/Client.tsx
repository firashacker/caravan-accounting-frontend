import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { DefaultButtonStyle } from "../components/Button/Button.component";
import ClientDebits from "./Client.Debits";
import ClientIncomes from "./Client.Incomes";
import ClientStatement from "./Client.Statement";

function Client() {
  const clientId = Number(useParams().id);
  const clientName = useParams().name;
  const page = useParams().page;

  return (
    <>
      <div className=" p-8 flex flex-col  space-x-4 fixed bg-blue-100 min-w-full border-b-2 border-black">
        <div className="flex pb-4 text-xl">
          <FontAwesomeIcon className="p-1" icon={faPerson} />
          <h1>{clientName}</h1>
          <p className="px-2 text-sm">[ عميل ]</p>
        </div>
        <div className="pt-4">
          <NavButtons clientId={clientId} clientName={clientName} page={page} />
        </div>
      </div>
      <div className="pt-50">
        <NavPage clientId={clientId} page={page} />
      </div>
    </>
  );
}

const NavPage = ({
  clientId,
  page,
}: {
  clientId: number;
  page: string | undefined;
}) => {
  switch (page) {
    case "statement":
      {
        return <ClientStatement clientId={clientId} />;
      }
      break;
    case "incomes":
      {
        return <ClientIncomes clientId={clientId} />;
      }
      break;
    case "debits":
      {
        return <ClientDebits clientId={clientId} />;
      }
      break;
    default:
      return <></>;
      break;
  }
};

const NavButtons = ({
  clientId,
  page,
  clientName,
}: {
  clientId: number;
  clientName: string | undefined;
  page: string | undefined;
}) => {
  const endPoint = `/clients/${clientId}/${clientName}`;
  switch (page) {
    case "statement":
      {
        return (
          <div>
            <Link className={DefaultButtonStyle} to={`${endPoint}/incomes`}>
              عرض الدفع
            </Link>
            <Link className={DefaultButtonStyle} to={`${endPoint}/debits`}>
              عرض الفواتير
            </Link>
          </div>
        );
      }
      break;
    case "incomes":
      {
        return (
          <div>
            <Link className={DefaultButtonStyle} to={`${endPoint}/statement`}>
              كشف الحساب
            </Link>
            <Link className={DefaultButtonStyle} to={`${endPoint}/debits`}>
              عرض الفواتير
            </Link>
          </div>
        );
      }
      break;
    case "debits":
      {
        return (
          <div>
            <Link className={DefaultButtonStyle} to={`${endPoint}/statement`}>
              كشف الحساب
            </Link>
            <Link className={DefaultButtonStyle} to={`${endPoint}/incomes`}>
              عرض الدفع
            </Link>
          </div>
        );
      }
      break;
  }
};

export default Client;
