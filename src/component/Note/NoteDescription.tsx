type NoteDescriptionProps = {
  description: string;
  list?: { id: number; data: string }[];
};
const NoteDescription = ({ description, list }: NoteDescriptionProps) => {
  return (
    <>
      {list && list.length > 0 ? (
        <div className="max-h-[430px] overflow-hidden ">
          <ul>
            {list.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                <input type="checkbox" />
                <span>{item.data}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="max-h-[430px] overflow-hidden ">
        <p>{description}</p>
      </div>
    </>
  );
};

export default NoteDescription;
