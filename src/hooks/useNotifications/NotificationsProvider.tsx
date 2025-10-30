import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  Badge,
  Button,
  IconButton,
  Snackbar,
  SnackbarContent,
} from "@mui/material";
import type { SnackbarCloseReason } from "@mui/material/Snackbar";
import type { CloseReason } from "@mui/material/SpeedDial";
import CloseIcon from "@mui/icons-material/Close";
import useSlotProps from "@mui/utils/useSlotProps";
import NotificationsContext from "./NotificationsContext";
import type {
  CloseNotification,
  ShowNotification,
  ShowNotificationOptions,
} from "./useNotifications";

const RootPropsContext = createContext<NotificationsProviderProps | null>(null);

interface NotificationProps {
  notificationKey: string;
  badge: string | null;
  open: boolean;
  message: React.ReactNode;
  options: ShowNotificationOptions;
}

function Notification({
  notificationKey,
  open,
  message,
  options,
  badge,
}: NotificationProps) {
  const notificationsContext = useContext(NotificationsContext);
  if (!notificationsContext) {
    throw new Error("Notifications context was used without a provider.");
  }
  const { close } = notificationsContext;

  const { severity, actionText, onAction, autoHideDuration } = options;

  const handleClose = useCallback(
    (event: unknown, reason?: CloseReason | SnackbarCloseReason) => {
      if (reason === "clickaway") {
        return;
      }
      close(notificationKey);
    },
    [notificationKey, close]
  );

  const action = (
    <>
      {onAction ? (
        <Button color="inherit" size="small" onClick={onAction}>
          {actionText ?? "Action"}
        </Button>
      ) : null}
      <IconButton
        size="small"
        aria-label="Close"
        title="Close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  const props = useContext(RootPropsContext);
  const snackbarSlotProps = useSlotProps({
    elementType: Snackbar,
    ownerState: props,
    externalSlotProps: {},
    additionalProps: {
      open,
      autoHideDuration,
      onClose: handleClose,
      action,
    },
  });

  return (
    <Snackbar key={notificationKey} {...snackbarSlotProps}>
      <Badge badgeContent={badge} color="primary" sx={{ width: "100%" }}>
        {severity ? (
          <Alert severity={severity} sx={{ width: "100%" }} action={action}>
            {message}
          </Alert>
        ) : (
          <SnackbarContent message={message} action={action} />
        )}
      </Badge>
    </Snackbar>
  );
}

interface NotificationQueueEntry {
  notificationKey: string;
  options: ShowNotificationOptions;
  open: boolean;
  message: React.ReactNode;
}

interface NotificationsState {
  queue: NotificationQueueEntry[];
}

interface NotificationsProps {
  state: NotificationsState;
}

function Notifications({ state }: NotificationsProps) {
  const currentNotification = state.queue[0] ?? null;

  return currentNotification ? (
    <Notification
      {...currentNotification}
      badge={state.queue.length > 1 ? String(state.queue.length) : null}
    />
  ) : null;
}

export interface NotificationsProviderProps {
  children?: React.ReactNode;
}

let nextId = 0;
const generateId = () => {
  const id = nextId;
  nextId += 1;
  return id;
};

export const NotificationsProvider = (props: NotificationsProviderProps) => {
  const { children } = props;
  const [state, setState] = useState<NotificationsState>({ queue: [] });

  const show = useCallback<ShowNotification>((message, options = {}) => {
    const notificationKey =
      options.key ?? `::toolpad-internal::notification::${generateId()}`;
    setState((prev) => {
      if (prev.queue.some((n) => n.notificationKey === notificationKey)) {
        return prev;
      }
      return {
        ...prev,
        queue: [
          ...prev.queue,
          { message, options, notificationKey, open: true },
        ],
      };
    });
    return notificationKey;
  }, []);

  const close = useCallback<CloseNotification>((key) => {
    setState((prev) => ({
      ...prev,
      queue: prev.queue.filter((n) => n.notificationKey !== key),
    }));
  }, []);

  const contextValue = useMemo(() => ({ show, close }), [show, close]);

  return (
    <RootPropsContext.Provider value={props}>
      <NotificationsContext.Provider value={contextValue}>
        {children}
        <Notifications state={state} />
      </NotificationsContext.Provider>
    </RootPropsContext.Provider>
  );
};
