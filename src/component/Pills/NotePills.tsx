type PillProps = {
  title: string;
  color?: string;
};
const NotePills = ({ title, color }: PillProps) => {
  return (
    <>
      <div
        className={`hover:bg-secondary text-nowrap border-borderColor border rounded-[8px] w-fit px-3 py-1 cursor-pointer 
       transition-colors duration-200
            text-[12px]
      `}
        style={{ backgroundColor: color }}
      >
        {title}
      </div>
    </>
  );
};

export default NotePills;
