interface ButtonOptions {
  children?: React.ReactNode | string;
  extraClasses?: string;
  onButtonClick: () => void;
}

export const DefaultButtonStyle = `p-2 bg-gradient-to-bl from-purple-300 to-blue-500 hover:from-blue-400 shadow-2xl rounded-sm`;

const DefaultButton = ({
  onButtonClick,
  children,
  extraClasses,
}: ButtonOptions) => {
  return (
    <button
      className={`${DefaultButtonStyle} ${extraClasses}`}
      onClick={onButtonClick}
    >
      {children}
    </button>
  );
};

export default DefaultButton;
