import React, { createContext, useContext, useEffect, useState } from "react";
import { socketService } from "@/utils/socket";
import { useUser } from "@/context/userContext";

interface SocketCtx {
  connected: boolean;
}

const SocketContext = createContext<SocketCtx>({
  connected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const userId = user?.id;

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    socketService.connect(userId);

    socketService.on("connect", () => setConnected(true));
    socketService.on("disconnect", () => setConnected(false));

    return () => {
      socketService.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
