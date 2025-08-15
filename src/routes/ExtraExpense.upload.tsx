import { useState } from "react";
import apiInstance from "../lib/axios";
import FormInput from "../components/FormInput/FormInput.component";
import DefaultButton from "../components/Button/Button.component";
import Spinner from "../components/Spinner/Spinner.component";
import {
  expensesEndPoint,
  type ExpenseType,
} from "../state/Expenses/Expenses.slice";

const ExtraExpenseUpload = () => {
  const [amount, setAmount] = useState<number>();
  const [description, setDescription] = useState<string>();
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
    if (!amount) return alert("لا يمكن ترك المبلغ فارغاً");
    if (!confirm("متأكد؟")) return;
    setclicked(true);
    try {
      const payload: ExpenseType = {
        amount: amount,
        description: description || "مصاريف عمل",
        work: true,
      };

      const response = await apiInstance.post(expensesEndPoint, payload);
      console.log(response);
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
          inputId="amount"
          label="المبلغ"
          inputType="number"
          inputPlaceHolder="المبلغ"
          inputRequired={true}
          onInputChange={(event) => {
            setAmount(Number(event.target.value));
          }}
          inputName="Amount"
        />
      </div>
      <div className="mb-5 pt-12 ">
        <FormInput
          inputId="description"
          label="الوصف"
          inputType="text"
          inputPlaceHolder="الوصف"
          inputRequired={true}
          onInputChange={(event) => {
            setDescription(event.target.value);
          }}
          inputName="Description"
        />
      </div>

      <ShowUpload />
    </div>
  );
};

export default ExtraExpenseUpload;
