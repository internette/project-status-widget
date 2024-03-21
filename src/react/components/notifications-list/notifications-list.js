import { useEffect, useState, useRef } from "react";
import cs from "classnames";
import Notification from "@psw/components/notification/notification";
import styles from "./notifications-list.module.scss";

const NotificationsList = ({ notifications }) => {
  console.log(notifications);
  const isOnlyNotification = notifications.length === 1;
  const indexRef = useRef(0);
  const notificationRef = useRef(notifications[0]);
  const [animateNextNotification, setAnimateNextNotification] = useState(false);
  useEffect(() => {
    if (!isOnlyNotification && animateNextNotification) {
      const nextIndex =
        indexRef.current === notifications.length - 1
          ? 0
          : indexRef.current + 1;
      indexRef.current = nextIndex;
      notificationRef.current = notifications[nextIndex];
      setAnimateNextNotification(false);
    }
  }, [isOnlyNotification, notifications, animateNextNotification]);

  return (
    <div className={cs(styles.notificationsListContainer)}>
      <div className={cs(styles.notificationsList)}>
        <Notification
          notificationDetails={notificationRef.current}
          isOnlyNotification={isOnlyNotification}
          setAnimateNextNotification={setAnimateNextNotification}
        />
      </div>
    </div>
  );
};

export default NotificationsList;
