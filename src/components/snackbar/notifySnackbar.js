import { useEffect, useState, useContext } from "react";
import { SnackbarProvider, useSnackbar, closeSnackbar } from "notistack";
import ButtonIcon from "components/button/ButtonIcon";
import { EButtonIconType, ENotifyObjectType } from "configs";
import { TaskCommentNotify } from "./";
import { SignalRContext } from "helpers";
import eventEmitter from "helpers/eventEmitter";
import _ from "lodash";

function NotifySnackbarContent() {
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState({});
  const connection = useContext(SignalRContext);
  const autoHideDuration = 3000;
  const taskNotifyObjectTypes = [
    ENotifyObjectType.taskComment,
    ENotifyObjectType.taskAssigned,
    ENotifyObjectType.taskCommentReply,
  ];

  useEffect(() => {
    if (connection) {
      connection.on("notify", (message) => {
        setMessage(message);
      });
    }

    return () => {
      if (connection) {
        connection.off("notify");
      }
    };
  }, [connection]);

  useEffect(() => {
    if (!_.isNil(message.id)) {
      onNewNotify(message);
    }
  }, [message.id]);

  const onNewNotify = (message) => {
    if (_.includes(taskNotifyObjectTypes, message.type)) {
      enqueueSnackbar("", {
        data: message,
        variant: "taskCommentNotify",
        autoHideDuration: autoHideDuration,
      });
      eventEmitter.emit("newNotify", message);
    }
  };

  return "";
}

export default function NotifySnackbar() {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      Components={{
        taskCommentNotify: TaskCommentNotify,
      }}
      maxSnack={3}
      action={(snackbarId) => (
        <ButtonIcon
          className="close-notify-icon"
          type={EButtonIconType.close}
          onClick={() => closeSnackbar(snackbarId)}
        />
      )}
    >
      <NotifySnackbarContent />
    </SnackbarProvider>
  );
}
