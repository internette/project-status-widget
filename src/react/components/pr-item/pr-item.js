import cs from "classnames";
import styles from "./pr-item.module.scss";

const PrLineItem = ({ prDetails }) => {
  const { provider, linkAddress, prName, state, isDraft, owner, repository } =
    prDetails;
  return (
    <li className={cs(styles[`${provider}Link`], styles.lineItem)}>
      <div className={cs(styles.prInfo)}>
        <p className={cs(styles.prLinkContainer)}>
          <a
            href={linkAddress}
            className={cs(styles[state], styles.prLink, {
              [styles.draft]: isDraft,
            })}
          >
            <i
              className={cs(
                "fa-solid",
                "fa-brands",
                `fa-${provider}`,
                styles.listIcon
              )}
            ></i>
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
      <a href={owner.url} className={cs(styles.prOwner)}>
        {owner.name}
      </a>
    </li>
  );
};

export default PrLineItem;
