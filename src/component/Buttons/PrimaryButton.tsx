type PrimaryButtonProps = {
  title: string;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

const PrimaryButton = ({
  title,
  onClick,
  isLoading,
  disabled,
}: PrimaryButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="w-full hover:bg-secondary cursor-pointer flex justify-center p-2 mt-4 rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default PrimaryButton;
