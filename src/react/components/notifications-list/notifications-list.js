import cs from "classnames";
import Notification from "@psw/components/notification/notification";
import styles from "./notifications-list.module.scss";

const NotificationsList = ({ notifications }) => {
    const isOnlyNotification = notifications.length === 1;
    return <div className={cs(styles.notificationsListContainer)}>
        <div className={cs(styles.notificationsList)}>{
            notifications.map((notification, index )=> {
                return <Notification notificationDetails={notification} isOnlyNotification={isOnlyNotification} index={index}/>
            })}</div>
    </div>
}

export default NotificationsList;