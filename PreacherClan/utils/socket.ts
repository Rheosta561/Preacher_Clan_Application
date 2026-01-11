import { io, Socket } from "socket.io-client";

/**
 * IMPORTANT:
 * - Use websocket only (Expo compatible)
 * - autoConnect = false (connect after login)
 */
const SOCKET_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });

    this.socket.connect();

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
      this.socket?.emit("userOnline", userId);
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }
  off(event: string, callback: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }


  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
