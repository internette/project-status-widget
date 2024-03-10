import PrLineItem from "../pr-item/pr-item";

const PrList = ({ prs }) => {
  return (
    <div>
      <ul>
        {prs.map((pr) => {
          const { title, html_url, state } = pr;
          const provider =
            html_url.indexOf("github") >= 0 ? "github" : "gitlab";
          const prDetails = {
            linkAddress: html_url,
            prName: title,
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
