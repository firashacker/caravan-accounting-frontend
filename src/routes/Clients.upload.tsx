import { useState } from "react";
import apiInstance from "../lib/axios";
import FormInput from "../components/FormInput/FormInput.component";
import DefaultButton from "../components/Button/Button.component";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";
import { type ClientType } from "../state/Clients/Clients.slice";
import { fetchClients } from "../state/Clients/Clients.slice";
import { clientsEndPoint } from "../state/Clients/Clients.slice";

const ClientUpload = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>();
  //const [balance, setBalance] = useState(0);
  //const [debt, setDebt] = useState(0);
  const [clicked, setclicked] = useState(false);

  const ShowUpload = () => {
    if (clicked) return;

    return (
      <DefaultButton
        extraClasses="min-w-full py-3"
        onButtonClick={() => {
          handelSubmit();
        }}
      >
        Post
      </DefaultButton>
    );
  };

  const handelSubmit = async () => {
    if (!name) return alert("لا يمكن ترك الاسم فارغاً");
    if (!confirm("متأكد؟")) return;
    setclicked(true);
    try {
      const payload: ClientType = {
        name: name,
      };

      const response = await apiInstance.post(clientsEndPoint, payload);
      console.log(response);
      dispatch(fetchClients());

      setTimeout(() => window.history.back(), 500);
    } catch (error) {
      alert(error);
      setclicked(false);
    }
  };

  return (
    <div className="pb-10 max-w-sm mx-auto">
      {clicked && <Spinner />}
      <div className="mb-5 pt-12 ">
        <FormInput
          inputId="Name"
          label="اسم العميل"
          inputType="text"
          inputPlaceHolder="الاسم"
          inputRequired={true}
          onInputChange={(event) => {
            setName(event.target.value);
          }}
          inputName="Name"
        />
      </div>

      <ShowUpload />
    </div>
  );
};

export default ClientUpload;
