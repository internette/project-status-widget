import cs from "classnames";
import Notification from "@psw/components/notification/notification";
import styles from "./notifications-list.module.scss";

const NotificationsList = ({ notifications }) => {
    const isOnlyNotification = notifications.length === 1;
    return <div className={cs(styles.notificationsListContainer)}>
        <div className={cs(styles.notificationsList)}>{
            notifications.map(notification => {
                return <Notification notificationDetails={notification} isOnlyNotification={isOnlyNotification}/>
            })}</div>
    </div>
}

export default NotificationsList;