type PillProps = {
  title: string;
};
const Pills = ({ title }: PillProps) => {
  return (
    <>
      <div
        className="hover:bg-secondary text-nowrap border-borderColor border rounded-[8px] w-fit px-4 py-2 cursor-pointer 
       transition-colors duration-200
        text-body2
      
      "
      >
        {title}
      </div>
    </>
  );
};

export default Pills;
