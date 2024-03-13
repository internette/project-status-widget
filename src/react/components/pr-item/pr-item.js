import cs from "classnames";
import styles from "./pr-item.module.scss";

const PrLineItem = ({ prDetails }) => {
  const { provider, linkAddress, prName, state } = prDetails;
  return (
    <li className={cs(styles[provider], styles.lineItem)}>
      <a href={linkAddress} className={cs(styles[state], styles.lineItemLink)}>
        <strong>
          <span>{prName}</span>
        </strong>
      </a>
    </li>
  );
};

export default PrLineItem;
