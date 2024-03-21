import cs from "classnames";
import styles from "./notification.module.scss";

const Notification = ({
  notificationDetails,
  isOnlyNotification,
  setAnimateNextNotification
}) => {
  const notificationMap = {
    review_requested: {
      displayName: "Review Requested"
    },
    mentioned: {
      displayName: "Mentioned"
    },
    state_change: {
      displayName: "Updated"
    },
    approval_requested: {
      displayName: "Approval Requested"
    },
    team_mentioned: {
      displayName: "Team Mention"
    }
  };
  return (
    <p
      className={cs(styles.notification, styles[notificationDetails.reason], {
        [styles.multipleNotifications]: !isOnlyNotification
      })}
      onAnimationEnd={() => {
        setAnimateNextNotification(true);
      }}
      key={`notification-${notificationDetails.id}`}
    >
      {notificationMap[notificationDetails.reason].displayName}
    </p>
  );
};

export default Notification;
