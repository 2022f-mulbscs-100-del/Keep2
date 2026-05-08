type NoteTitleProps = {
  title: string;
};

const NoteTitle = ({ title }: NoteTitleProps) => {
  return (
    <>
      {title && (
        <div className="font-black flex justify-between">
          <div className="w-[200px] max-h-[120px] overflow-hidden mb-4">
            <p className="whitespace-normal break-words">{title}</p>
          </div>

          {/* hover indicator (CSS only, no re-render) */}
          <div className="transition-all duration-300 opacity-0 group-hover:opacity-100" />
        </div>
      )}
    </>
  );
};

export default NoteTitle;
