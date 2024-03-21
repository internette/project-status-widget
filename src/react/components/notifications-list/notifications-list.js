import { useEffect, useState, useRef } from "react";
import cs from "classnames";
import Notification from "@psw/components/notification/notification";
import styles from "./notifications-list.module.scss";

const NotificationsList = ({ notifications }) => {
  const isOnlyNotification = notifications.length === 1;
  const [currentIndex, setCurrentIndex] = useState(0);
  const notificationRef = useRef(notifications[0]);
  useEffect(() => {
    if (!isOnlyNotification) {
        const setNextIndex = setTimeout(()=> {
            const nextIndex = currentIndex === notifications.length -1 ? 0 : currentIndex + 1;
            setCurrentIndex(nextIndex);
            notificationRef.current = notifications[nextIndex];
        }, 2000);
        return ()=> clearTimeout(setNextIndex);
    }
  }, [currentIndex, isOnlyNotification, notifications]);

  return (
    <div className={cs(styles.notificationsListContainer)}>
      <div className={cs(styles.notificationsList)}>
        <Notification
          notificationDetails={notificationRef.current}
          isOnlyNotification={isOnlyNotification}
        />
      </div>
    </div>
  );
};

export default NotificationsList;
