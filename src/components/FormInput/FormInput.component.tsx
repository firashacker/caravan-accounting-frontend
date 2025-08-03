interface FormInputProps {
  inputId: string;
  label: string;
  inputName?: string;
  inputType?: string;
  inputValue?: string;
  inputPlaceHolder?: string;
  inputAccept?: string;
  inputRequired?: boolean;
  onInputChange?: (event: { target: { value: string } }) => void;
}

const FormInput = ({
  label,
  inputId,
  inputName,
  inputValue,
  inputType,
  inputAccept,
  inputRequired,
  onInputChange,
  inputPlaceHolder,
}: FormInputProps) => {
  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-md font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        id={inputId}
        value={inputValue}
        name={inputName}
        type={inputType}
        accept={inputAccept}
        placeholder={inputPlaceHolder}
        required={inputRequired}
        onChange={onInputChange}
        className="border-gray border-2 w-full px-4 py-3 mt-5 rounded-lg border-gray-200 bg-white shadow-sm appearance-none focus:border-blue-500 outline-none focus:ring-2 ring-blue-500"
      />
    </div>
  );
};

export default FormInput;
