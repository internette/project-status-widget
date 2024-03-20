import cs from "classnames";
import styles from "./notification.module.scss";

const Notification = ({ notificationDetails, isOnlyNotification, index }) => {
    const notificationMap = {
        "review_requested": {
            displayName: "Review Requested"
        },
        "mentioned": {
            displayName: "Mentioned"
        },
        "state_change": {
            displayName: "Updated"
        },
        "approval_requested": {
            displayName: "Approval Requested"
        },
        "team_mentioned": {
            displayName: "Team Mention"
        }
    }
    const isFirst = index === 0 && !isOnlyNotification;
    return <p className={cs(styles.notification, styles[notificationDetails.reason], {
        [styles.multipleNotifications]: !isOnlyNotification,
        [styles.active]: isFirst
    })}>{notificationMap[notificationDetails.reason].displayName}</p>
}

export default Notification;