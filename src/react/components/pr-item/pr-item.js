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
  let meetsMinWidthRef = useRef(document.body.clientWidth > 400);
  let showNotificationsRef = useRef(notifications && notifications.length > 0 && meetsMinWidthRef.current);

  useEffect(()=> {
    meetsMinWidthRef.current = document.body.clientWidth > 400;
    showNotificationsRef.current = notifications && notifications.length > 0 && meetsMinWidthRef.current;
  }, [document.body.clientWidth, notifications, notifications?.length])

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
              [styles.draft]: isDraft,
            })}
          >
            {mergeableState.length > 0 && (
              <i
                className={cs("fa-solid", styles.listIcon, {
                  "fa-check": mergeableState === "clean",
                  [styles.merge]: mergeableState === "clean",
                  "fa-times": mergeableState === "blocked",
                  [styles.blocked]: mergeableState === "blocked",
                  "fa-rotate-right fa-spin": mergeableState === "unstable",
                  [styles.unstable]: mergeableState === "unstable",
                  "fa-exclamation-triangle": mergeableState === "dirty",
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
      {showNotificationsRef.current && <NotificationsList notifications={notifications}/>}
      <a href={owner.url} className={cs(styles.prOwner)}>
        {owner.name}
      </a>
    </li>
  );
};

export default PrLineItem;
