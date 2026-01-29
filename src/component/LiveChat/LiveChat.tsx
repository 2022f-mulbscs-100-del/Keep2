type LiveChatProps = {
  serverMessage: { message: string; from: string };
};

const LiveChat = ({ serverMessage }: LiveChatProps) => {
  return (
    <>
      <div className="border border-borderColor rounded-lg shadow-md p-4 mt-4">
        {serverMessage && (
          <div>
            <h3 className="text-subheading2 font-bold mb-2">
              New Message from {serverMessage.from}:
            </h3>
            <p className="text-body">{serverMessage.message}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default LiveChat;
