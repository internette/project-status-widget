import PrLineItem from "@psw/components/pr-item/pr-item";
import cs from "classnames";
import styles from "./pr-list.module.scss";

const PrList = ({ prs }) => {
  console.log(prs);
  return (
    <div>
      <ul className={cs(styles.prList)}>
        {prs.map((pr) => {
          const { title, html_url, state, draft } = pr;
          const provider =
            html_url.indexOf("github") >= 0 ? "github" : "gitlab";
          const prDetails = {
            linkAddress: html_url,
            prName: title,
            isDraft: draft,
            provider,
            state,
          };
          return <PrLineItem prDetails={prDetails} />;
        })}
      </ul>
    </div>
  );
};

export default PrList;
