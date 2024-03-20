import cs from "classnames";
import styles from "./pr-item.module.scss";
import NotificationsList from "../notifications-list/notifications-list";

const PrLineItem = ({ prDetails, index }) => {
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
    notifications,
    prNumber
  } = prDetails;
  // const showNotifications = notifications && notifications.length > 0;
  const showNotifications = index === 2 && true;
  const mockNotifications = [{
    id: "12345",
    last_read_at: new Date(),
    reason: "review_requested",
    subject: {
      latest_comment_url: "",
      title: "Test Review Requested",
      type: "PullRequest",
      url: `https://api.github.com/repos/${repository.owner}/${repository.name}/pulls/${prNumber}`
    },
    unread: true
  }, {
    id: "12345",
    last_read_at: new Date(),
    reason: "mentioned",
    subject: {
      latest_comment_url: "",
      title: "Test Review Requested",
      type: "PullRequest",
      url: `https://api.github.com/repos/${repository.owner}/${repository.name}/pulls/${prNumber}`
    },
    unread: true
  }, {
    id: "12345",
    last_read_at: new Date(),
    reason: "state_change",
    subject: {
      latest_comment_url: "",
      title: "Test Review Requested",
      type: "PullRequest",
      url: `https://api.github.com/repos/${repository.owner}/${repository.name}/pulls/${prNumber}`
    },
    unread: true
  }]

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
      {showNotifications && <NotificationsList notifications={mockNotifications}/>}
      <a href={owner.url} className={cs(styles.prOwner)}>
        {owner.name}
      </a>
    </li>
  );
};

export default PrLineItem;
