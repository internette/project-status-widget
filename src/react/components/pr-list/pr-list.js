import PrLineItem from "@psw/components/pr-item/pr-item";
import cs from "classnames";
import styles from "./pr-list.module.scss";

const PrList = ({ prs, provider }) => {
  return (
    <ul className={cs(styles.prList)}>
      {prs.map((pr) => {
        const { title, html_url, state, draft, user, id, number, repository } =
          pr;
        const prOwner = {
          name: user?.login || "",
          url: user?.html_url || "",
        };
        const prDetails = {
          linkAddress: html_url,
          prName: title,
          isDraft: draft,
          owner: prOwner,
          prNumber: number,
          repository,
          provider,
          state,
          id,
        };
        return <PrLineItem prDetails={prDetails} key={`pr-${id}`} />;
      })}
    </ul>
  );
};

export default PrList;
