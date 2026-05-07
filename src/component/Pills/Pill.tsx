type PillProps = {
  title: string;
  disabled?: boolean;
};
const Pills = ({ title, disabled }: PillProps) => {
  return (
    <>
      <div
        className={`text-nowrap border-borderColor border rounded-[8px] w-fit px-4 py-2
       transition-colors duration-200 text-body2
       ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary cursor-pointer"}
      `}
      >
        {title}
      </div>
    </>
  );
};

export default Pills;
