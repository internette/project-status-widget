import cs from "classnames";
import styles from "./pr-item.module.scss";
import NotificationsList from "../notifications-list/notifications-list";
import { useEffect, useRef } from "react";

const PrLineItem = ({ prDetails }) => {
  const {
    provider,
    linkAddress,
    prName,
    state,
    isDraft,
    owner,
    repository,
    mergeableState,
    prId,
    notifications
  } = prDetails;
  let showNotificationsRef = useRef(notifications && notifications.length > 0);
  useEffect(() => {
    showNotificationsRef.current = notifications && notifications.length > 0;
  }, [notifications, notifications?.length]);
  const showIcon = mergeableState.length > 0 && !isDraft;

  return (
    <li
      className={cs(styles[`${provider}Link`], styles.lineItem)}
      key={`pr-${prId || ""}`}
    >
      <div className={cs(styles.prInfo)}>
        <p className={cs(styles.prLinkContainer)}>
          <a
            href={linkAddress}
            className={cs(styles[state], styles.prLink, {
              [styles.draft]: isDraft
            })}
          >
            {showIcon && (
              <i
                className={cs("fa-solid", styles.listIcon, {
                  "fa-check": mergeableState === "clean",
                  [styles.merge]: mergeableState === "clean",
                  "fa-times": mergeableState === "blocked",
                  [styles.blocked]: mergeableState === "blocked",
                  "fa-rotate-right fa-spin": mergeableState === "unstable",
                  [styles.unstable]: mergeableState === "unstable",
                  "fa-exclamation-triangle": mergeableState === "dirty"
                })}
              ></i>
            )}
            <strong>
              <span>{prName}</span>
            </strong>
          </a>
        </p>
        <p className={cs(styles.repoNameContainer)}>
          <i
            className={cs("fa", "fa-level-up", styles.iconLevelUp)}
            aria-hidden="true"
          ></i>
          <a href={repository.url} className={cs(styles.repoNameLink)}>
            {repository.name}
          </a>
        </p>
      </div>
      {showNotificationsRef.current && (
        <NotificationsList notifications={notifications} />
      )}
      <a href={owner.url} className={cs(styles.prOwner)}>
        {owner.name}
      </a>
    </li>
  );
};

export default PrLineItem;
