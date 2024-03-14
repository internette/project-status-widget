import cs from "classnames";
import styles from "./pr-item.module.scss";

const PrLineItem = ({ prDetails }) => {
  const { provider, linkAddress, prName, state } = prDetails;
  return (
    <li className={cs(styles[`${provider}Link`], styles.lineItem)}>
      <a href={linkAddress} className={cs(styles[state], styles.lineItemLink)}>
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
    </li>
  );
};

export default PrLineItem;
