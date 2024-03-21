import { useEffect, useState } from "react";
import cs from "classnames";
import Notification from "@psw/components/notification/notification";
import styles from "./notifications-list.module.scss";

const NotificationsList = ({ notifications }) => {
  const isOnlyNotification = notifications.length === 1;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentNotification, setCurrentNotification] = useState(
    notifications[currentIndex]
  );

  useEffect(() => {
    if (!isOnlyNotification) {
      const setNextNotification = setTimeout(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setCurrentNotification(notifications[nextIndex]);
      }, 2000);
      return () => clearTimeout(setNextNotification);
    }
  }, []);

  useEffect(() => {
    if (currentIndex === notifications.length - 1) {
      setTimeout(() => {
        setCurrentIndex(0);
        setCurrentNotification(notifications[0]);
      }, 2000);
    }
  }, [currentIndex]);

  return (
    <div className={cs(styles.notificationsListContainer)}>
      <div className={cs(styles.notificationsList)}>
        <Notification
          notificationDetails={currentNotification}
          isOnlyNotification={isOnlyNotification}
        />
        {/* {notifications.map((notification, index) => {
          return (
            <Notification
              notificationDetails={notification}
              isOnlyNotification={isOnlyNotification}
              index={index}
            />
          );
        })} */}
      </div>
    </div>
  );
};

export default NotificationsList;
