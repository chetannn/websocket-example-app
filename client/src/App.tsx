import { useEffect, useState } from "react";
import { useWebsocket } from "./contexts/websocket-context";

const App = () => {
  const websocket = useWebsocket();
  const [messages, setMessages] = useState<string[]>(["hello"]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  useEffect(() => {
    if (!websocket) {
      return;
    }
    const handleWebSocketIncomingMessages = (event: MessageEvent) => {
      const newMessage = event.data;

      if (newMessage) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    websocket.addEventListener("message", handleWebSocketIncomingMessages);

    return () => {
      websocket.removeEventListener("message", handleWebSocketIncomingMessages);
    };
  }, [websocket]);

  return (
    <div className="grid place-items-center h-screen px-7">
      <h1 className="text-3xl font-bold underline">Hello Chat 💬</h1>

      <div className="min-h-[300px] border border-red-300 px-6 relative max-w-5xl w-full overflow-y-auto rounded-md">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
        <div className="w-full flex items-center absolute bottom-5 gap-4">
          <input
            value={inputMessage}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                websocket?.send(inputMessage);
                setInputMessage("");
              }
            }}
            onChange={(e) => setInputMessage(e.target.value)}
            className="px-3 py-2 border focus:outline-none rounded-md"
          />
          <button
            onClick={() => {
              websocket?.send(inputMessage);
              setInputMessage("");
            }}
            className="px-4 py-2 border rounded-md text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
