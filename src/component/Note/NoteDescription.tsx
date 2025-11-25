type NoteDescriptionProps = {
  description: string;
};
const NoteDescription = ({ description }: NoteDescriptionProps) => {
  return (
    <>
      <div className="max-h-[430px] overflow-hidden ">
        <p>{description}</p>
      </div>
    </>
  );
};

export default NoteDescription;
