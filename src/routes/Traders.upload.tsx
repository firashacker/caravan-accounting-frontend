import { useState } from "react";
import apiInstance from "../lib/axios";
import FormInput from "../components/FormInput/FormInput.component";
import DefaultButton from "../components/Button/Button.component";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";
import { type TraderType } from "../state/Traders/Traders.slice";
import { fetchTraders } from "../state/Traders/Traders.slice";
import { tradersEndPoint } from "../state/Traders/Traders.slice";

const TradersUpload = () => {
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
      const payload: TraderType = {
        name: name,
      };

      const response = await apiInstance.post(tradersEndPoint, payload);
      console.log(response);
      dispatch(fetchTraders());

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
          label="اسم التاجر"
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

export default TradersUpload;
