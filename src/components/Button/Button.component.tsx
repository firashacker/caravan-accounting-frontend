interface ButtonOptions {
  children?: React.ReactNode | string;
  extraClasses?: string;
  buttonType?: "button" | "submit" | "reset" | undefined;
  onButtonClick?: () => void;
}

export const DefaultButtonStyle = `p-2 m-2 bg-gradient-to-bl from-cyan-200 to-blue-300 hover:from-blue-200 shadow-2xl rounded-sm`;
export const SafeButtonStyle = `p-2 m-2 bg-green-500 hover:bg-green-700 shadow-2xl rounded-sm`;
export const DangerButtonStyle = `p-2 m-2 bg-red-500 hover:bg-red-700 shadow-2xl rounded-sm`;

const DefaultButton = ({
  onButtonClick,
  children,
  extraClasses,
  buttonType,
}: ButtonOptions) => {
  return (
    <button
      type={buttonType}
      className={`${DefaultButtonStyle} ${extraClasses}`}
      onClick={onButtonClick}
    >
      {children}
    </button>
  );
};

export const SafeButton = ({
  onButtonClick,
  children,
  extraClasses,
  buttonType,
}: ButtonOptions) => {
  return (
    <button
      type={buttonType}
      className={`${SafeButtonStyle} ${extraClasses}`}
      onClick={onButtonClick}
    >
      {children}
    </button>
  );
};
export const DangerButton = ({
  onButtonClick,
  children,
  extraClasses,
  buttonType,
}: ButtonOptions) => {
  return (
    <button
      type={buttonType}
      className={`${DangerButtonStyle} ${extraClasses}`}
      onClick={onButtonClick}
    >
      {children}
    </button>
  );
};

export default DefaultButton;
