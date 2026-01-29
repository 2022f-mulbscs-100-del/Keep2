import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "../../Context/UserContext";
import Pills from "../../component/Pills/Pill";
import { FaPaperPlane } from "react-icons/fa";

const WebSocketIntegration = () => {
  const { profileData } = useUser();

  // Socket reference (IMPORTANT)
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<{ message: string }[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    // Create socket ONCE
    socketRef.current = io("http://localhost:2404");

    // When connected
    socketRef.current.on("connect", () => {
      console.log("Connected to server:", socketRef.current?.id);

      // Register user
      socketRef.current?.emit("register", profileData?.name);
    });

    // Room message
    socketRef.current.on("roomMessage", (data: { message: string }) => {
      console.log("Received room message:", data);
      setMessages((prevMessages: { message: string }[]) => [
        ...prevMessages,
        data,
      ]);
    });

    // Disconnect
    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Cleanup
    return () => {
      socketRef.current?.disconnect();
    };
  }, [profileData?.name]);

  // JOIN ROOM
  const handleJoinRoom = () => {
    //join room
    socketRef.current?.emit("JoinRoom", "room1");
    console.log("Joined room1");
  };

  // SEND MESSAGE TO ROOM
  const handleSendRoomMessage = () => {
    socketRef.current?.emit("roomMessage", {
      room: "room1",
      message: "Hello room1 ",
    });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    console.log("Sending message:", inputMessage);
    socketRef.current?.emit("roomMessage", {
      room: "room1",
      message: inputMessage,
    });
    setInputMessage("");
  };

  return (
    <>
      <div>
        <div className="p-4 flex gap-4">
          <div onClick={handleJoinRoom}>
            <Pills title="Join Room" />
          </div>

          <div onClick={handleSendRoomMessage}>
            <Pills title="Send Room Message" />
          </div>
        </div>
        <div className="">
          {messages.map((msg, index) => (
            <div key={index} className="border p-2 my-2 rounded">
              {msg.message}
            </div>
          ))}
        </div>

        <div className="fixed bottom-20 w-lg left-1/2 transform -translate-x-1/2">
          <div className="  w-full flex items-center gap-4  px-4  py-2 rounded-[8px] bg-transparent border border-borderColor ">
            <input
              className="outline-none w-full text-body2"
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="type a message"
            />
            <div
              className=" cursor-pointer hover:bg-secondary"
              onClick={handleSendMessage}
            >
              <FaPaperPlane />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WebSocketIntegration;
