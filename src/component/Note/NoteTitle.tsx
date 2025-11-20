type NoteTitleProps = {
  title: string;
  IsHover: boolean;
};

const NoteTitle = ({ title, IsHover }: NoteTitleProps) => {
  return (
    <>
      {title && (
        <div className="font-black flex justify-between ">
          <div className="w-[200px] max-h-[120px] overflow-hidden mb-4  ">
            <p className="whitespace-normal break-words">{title}</p>
          </div>

          <div
            className={`transition-all z-100  duration-500 opacity-0 ${IsHover && `opacity-100`}`}
          ></div>
        </div>
      )}
    </>
  );
};

export default NoteTitle;
