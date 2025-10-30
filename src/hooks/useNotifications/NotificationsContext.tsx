import { createContext } from "react";
import { ShowNotification, CloseNotification } from "./useNotifications";

const NotificationsContext = createContext<{
  show: ShowNotification;
  close: CloseNotification;
} | null>(null);

export default NotificationsContext;
