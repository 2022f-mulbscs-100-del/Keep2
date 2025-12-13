type PillProps = {
  title: string;
};
const Pills = ({ title }: PillProps) => {
  return (
    <>
      <div className="hover:bg-[#52535596] border-[#525355] border rounded-[8px] w-fit px-4 py-2 cursor-pointer text-sm font-medium transition-colors duration-200">
        {title}
      </div>
    </>
  );
};

export default Pills;
