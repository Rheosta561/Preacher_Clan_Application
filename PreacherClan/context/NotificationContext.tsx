import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useUser } from "@/context/userContext";
import { apiFetch } from "@/utils/Auth/apiFetch";
import { showToast } from "@/utils/showToast";
import { socketService } from "@/utils/socket";

type Notification = {
  _id?: string;
  message: string;
  type?: "info" | "warning" | "error";
  isRead?: boolean;
  createdAt?: string;
};

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => Promise<void>;
}

const NotificationContext =
  createContext<NotificationContextType | null>(null);

const STORAGE_KEY = "notifications";

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const userId = user?.id;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  /* ---------------- LOAD STORED ---------------- */
  useEffect(() => {
    const loadStored = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setNotifications(JSON.parse(stored));
    };
    loadStored();
  }, []);


  useEffect(() => {
    if (!userId) return;

    const fetchUnread = async () => {
      try {
        const res = await apiFetch<{ count: number }>(
          `/notifications/unread/${userId}`
        );
        console.log('notification provider' , res);
        setUnreadCount(res.count);
      } catch (err) {
        console.error("Unread count fetch failed", err);
      }
    };

    fetchUnread();
  }, [userId]);


  useEffect(() => {
    if (!userId) return;

    socketService.connect(userId);

    const onNotification = (notification: Notification) => {
      showToast({
        type: "info",
        title: notification.message,
      });

      setNotifications((prev) => {
        const updated = [notification, ...prev];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      setUnreadCount((prev) => prev + 1);
    };

    socketService.on("notification", onNotification);

    return () => {
      socketService.off("notification", onNotification);
    };
  }, [userId]);


  useEffect(() => {
    if (!userId) return;

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        socketService.connect(userId);
      } else {
        socketService.disconnect();
      }
    });

    return () => sub.remove();
  }, [userId]);

  /* ---------------- MARK ALL READ ---------------- */
  const markAllRead = async () => {
    if (!userId) return;

    try {
      await apiFetch(`/notifications/read/${userId}`, {
        method: "POST",
      });

      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotification must be used inside NotificationProvider"
    );
  return ctx;
};
