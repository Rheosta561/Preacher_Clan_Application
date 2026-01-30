import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { socketService } from "@/utils/socket";
import CustomToast from "../components/CustomToast";
import { ChatMessage } from "@/constants/chats";
import { useUser } from "./userContext";

type ChatContextType = {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  sendMessage: (data: any) => void;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;

  remoteTyping: boolean;   // ONLY other user typing
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // only for OTHER user typing
  const [remoteTyping, setRemoteTyping] = useState(false);

  const [toast, setToast] = useState({
    visible: false,
    type: "info" as "success" | "info" | "error",
    title: "",
    message: "",
  });

  // ---- user ----
  const user = useUser().user;
  const userId = user?.id;
  const profileImage = user?.profileImage ?? "";

  // ---- parser ----
  const safeParseMedia = (media: unknown): any[] => {
    try {
      if (!Array.isArray(media)) return [];
      return media.flatMap((m) =>
        typeof m === "string" ? JSON.parse(m) : [m]
      );
    } catch {
      return [];
    }
  };

  // ---- mapper ----
  const mapToChatMessage = (msg: any): ChatMessage => {
    const media = safeParseMedia(msg.media);

    const mapped: ChatMessage = {
      id: msg._id,
      text: msg.content,
      sender: msg.sender._id === userId ? "me" : "other",
      profileImage:
        msg.sender._id === userId
          ? profileImage
          : msg.sender.image ?? "https://i.pravatar.cc/150",
      timestamp: msg.createdAt ?? new Date(),
      replyTo: msg.replyTo?._id ?? null,
    };

    media.forEach((m: any) => {
      if (m.type === "image") mapped.image = m.url;
      else if (m.type === "video") mapped.video = m.url;
      else if (m.type === "audio") mapped.audio = m.url;
      else mapped.file = m.url;

      mapped.fileName = m.fileName ?? m.url?.split("/")?.pop();
    });

    return mapped;
  };

  // ---- SOCKET CONNECTION ----
  useEffect(() => {
    if (!userId) return;

    socketService.connect(userId);
    return () => socketService.disconnect();
  }, [userId]);

  // ---- TYPING EVENTS (only remote user) ----
  useEffect(() => {
    const onStart = ({ chatId }: { chatId: string }) => {
      if (chatId === currentChatId) setRemoteTyping(true);
    };

    const onStop = ({ chatId }: { chatId: string }) => {
      if (chatId === currentChatId) setRemoteTyping(false);
    };

    socketService.on("typing:start", onStart);
    socketService.on("typing:stop", onStop);

    return () => {
      socketService.off("typing:start", onStart);
      socketService.off("typing:stop", onStop);
    };
  }, [currentChatId]);

  // ---- NEW MESSAGE EVENTS ----
  useEffect(() => {
    if (!userId) return;

    const handler = (msg: any) => {
      const msgChatId =
        msg.chat?._id ??
        msg.chat ??
        msg.chatId ??
        msg.chatID ??
        null;

      const formatted = mapToChatMessage(msg);

      // belongs to open chat
      if (msgChatId && msgChatId.toString() === currentChatId) {
        setMessages((prev) =>
          prev.some((m) => m.id === formatted.id)
            ? prev
            : [...prev, formatted]
        );
        return;
      }

      // belongs to another chat → toast
      console.log('toast');
      setToast({
        visible: true,
        type: "info",
        title: `New message from ${msg.sender?.username ?? "someone"}`,
        message:
          formatted.text
            ? formatted.text.slice(0, 40)
            : formatted.image
            ? "📷 Sent a photo"
            : formatted.video
            ? "🎥 Sent a video"
            : formatted.audio
            ? "🎤 Sent a voice note"
            : "📎 Sent a file",
      });

      setTimeout(() => {
        setToast((t) => ({ ...t, visible: false }));
      }, 4000);
    };

    socketService.on("newMessage", handler);
    return () => socketService.off("newMessage", handler);
  }, [userId , currentChatId]);

  // ---- SEND ----
  const sendMessage = (data: any) => {
    socketService.emit("sendMessage", data);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        sendMessage,
        currentChatId,
        setCurrentChatId,
        remoteTyping,
      }}
    >
      {children}

      <CustomToast
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};
