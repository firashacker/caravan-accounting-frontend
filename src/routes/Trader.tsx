import { useSelector } from "react-redux";
import { type RootState } from "../state/store";
import Spinner from "../components/Spinner/Spinner.component";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type TraderType } from "../state/Traders/Traders.slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import DefaultButton, {
  DangerButton,
  SafeButton,
} from "../components/Button/Button.component";
//import { useDispatch } from "react-redux";
//import { type AppDispatch } from "../state/store";
//import { fetchTraders } from "../state/Traders/Traders.slice";
//import apiInstance from "../lib/axios";
//import { tradersEndPoint } from "../state/Traders/Traders.slice";

function Trader() {
  const { traderList, status } = useSelector(
    (state: RootState) => state.traders,
  );
  //const dispatch = useDispatch<AppDispatch>();
  const traderId = useParams().id;
  const [trader, setTrader] = useState<TraderType>();
  const [reset, setReset] = useState(false);

  useEffect(() => {
    const result = traderList.find((e) => e.id === Number(traderId));
    setTrader(result);
  }, [traderId, reset]);

  return (
    <>
      {status === "loading" && <Spinner />}

      <div className=" p-8 flex flex-col  space-x-4">
        <div className="flex pb-4 text-xl">
          <FontAwesomeIcon className="p-1" icon={faPerson} />
          <h1>{trader?.name}</h1>
          <p className="px-2 text-sm">[ تاجر ]</p>
        </div>
      </div>
      <table className="min-w-full border-s-slate-950 border-2">
        <thead>
          <tr className="bg-blue-200">
            <td className="p-4 ">المعرف</td>
            <td className="p-4">القيمة</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-s-slate-950 border-2 p-2">الية الحساب</td>
            <td className="border-s-slate-950 border-2 p-2">اي شيء</td>
          </tr>
        </tbody>
      </table>
      <div className="p-8 space-x-2">
        <DefaultButton>تسجيل دفعة</DefaultButton>
        <SafeButton onButtonClick={() => setReset(!reset)}>
          التراجع عن جميع الحركات
        </SafeButton>
        <DangerButton>تأكيد و حفظ</DangerButton>
      </div>
    </>
  );
}

export default Trader;
