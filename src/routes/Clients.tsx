import { useSelector } from "react-redux";
import { type RootState } from "../state/store";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaravan, faUser } from "@fortawesome/free-solid-svg-icons";
import { DefaultButtonStyle } from "../components/Button/Button.component";
import { faAdd } from "@fortawesome/free-solid-svg-icons/faAdd";
import { useEffect, useState } from "react";
import {
  type ClientType,
  fetchClientsIfNeeded,
} from "../state/Clients/Clients.slice";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";
import FormInput from "../components/FormInput/FormInput.component";

//const paymentMethods = { dayly: "يومي", weekly: "اسبوعي", monthly: "شهري" };

function Clients() {
  const { clientList, status } = useSelector(
    (state: RootState) => state.clients,
  );
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<ClientType[]>();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchClientsIfNeeded());
  }, []);
  useEffect(() => {
    if (search === "") {
      setClients(clientList);
    } else {
      setClients(
        clientList.filter((client) =>
          client.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, clientList]);
  return (
    <>
      {status === "loading" && <Spinner />}
      <div className="bg-slate-100 p-8 flex flex-col  space-x-4">
        <div className="flex pb-4 text-xl space-x-2">
          <h1>العملاء</h1>
          <FontAwesomeIcon icon={faCaravan} />
        </div>
        <div>
          <Link
            className={`${DefaultButtonStyle} flex w-fit`}
            to="/clients/new"
          >
            <FontAwesomeIcon className="p-1" icon={faAdd} />
            <p>اضافة عميل</p>
          </Link>
          <FormInput
            inputId="search"
            label="بحث"
            inputType="text"
            onInputChange={(event) => setSearch(event.target.value)}
            inputName="username"
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        {clients &&
          clients.map((client) => (
            <Link
              key={client.id}
              className={`${DefaultButtonStyle} rounded-md m-4 w-full sm:w-50 sm:min-w-50 p-4 shdow-2xl`}
              to={`/clients/${client.id}/${client.name}/statement`}
            >
              <div className="min-w-full flex">
                <FontAwesomeIcon className="text-red-600" icon={faUser} />
                <p className="px-2">{client.name}</p>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}

export default Clients;
