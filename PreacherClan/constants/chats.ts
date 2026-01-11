// types/chat.ts

export type SenderType = "me" | "other";

export interface ChatMedia {
  type: "image" | "video" | "audio" | "file";
  url: string;
  fileName?: string;
}



export interface ChatMessage {
  id: string;
  tempId?: string;
  text?: string;
  image?: string;
  video?: string;
  audio?: string;
  file?: string;
  fileName?: string;
  sender: "me" | "other";
  profileImage: string;
  timestamp: Date | string;
  replyTo?: string | null;
  status?: "sending" | "sent" | "failed";
}



export interface Chat {
  id: string;
  name: string;
  isGroup?: boolean;
  participants: string[];
  profileImage?: string;
}

export interface ReplyState {
  messageId: string;
  previewText?: string;
}

export interface DropdownState {
  openFor?: string | null;
}

export interface HighlightState {
  id: string | null;
}
