import {
  ProviderProps,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";

interface WebsocketContextEntry {
  websocket: WebSocket | null;
}

const createWebSocket = (target: string) => {
  const websocket = new WebSocket(target);
  websocket.onerror = (error) => {
    console.error("websocket error", error);
  };
  websocket.onopen = () => {
    console.debug("websocket connection openend");
  };
  websocket.onclose = () => {
    console.debug("websocket connection closed");
  };
  return websocket;
};

const WebsocketContext = createContext<WebsocketContextEntry | undefined>(
  undefined
);

export const WebsocketProvider = ({
  children,
}: ProviderProps<WebsocketContextEntry | undefined>) => {
  const [websocket, _] = useState<WebSocket | null>(() =>
    createWebSocket("ws://localhost:3000/ws")
  );
  // const [websocketState, _] = useState<number | null>(null);

  useEffect(() => {
    const abortCtrl = new AbortController();
    if (!websocket) {
      console.debug("[Websocket] No connection established.. ");
      // openWebsocketIfPossible(host);
    }
    return () => abortCtrl.abort();
  }, [websocket]);

  return (
    <WebsocketContext.Provider value={{ websocket }}>
      {children}
    </WebsocketContext.Provider>
  );
};

export const useWebsocket = () => {
  const context = useContext(WebsocketContext);
  if (context === undefined) {
    throw new Error("useWebsocket must be used within a WebsocketProvider");
  }
  return context.websocket;
};
