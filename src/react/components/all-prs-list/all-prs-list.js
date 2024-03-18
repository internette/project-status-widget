import PrList from "@psw/components/pr-list/pr-list";
import cs from "classnames";
import styles from "./all-prs-list.module.scss";

const AllPrsList = ({ prs }) => {
  const githubDataObject = {
    name: "Github",
    icon: "square-github",
    baseHref: "https://github.com",
    prHref: "https://github.com/pulls",
  };
  const gitlabDataObject = {
    name: "Gitlab",
    icon: "square-gitlab",
    baseHref: "https://gitlab.com",
  };
  const providers = [githubDataObject, gitlabDataObject];
  return providers.map((provider) => {
    const providerNameLowercase = provider.name.toLowerCase();
    const hasPrs =
      prs[providerNameLowercase] && prs[providerNameLowercase].length > 0;
    return (
      <section className={cs(styles.providerSection)}>
        <input
          type="checkbox"
          id={`${providerNameLowercase}-toggle`}
          className={cs(styles.labelCheckbox)}
        />
        <label
          htmlFor={`${providerNameLowercase}-toggle`}
          className={cs(
            styles.providerLabel,
            styles[`${providerNameLowercase}Label`]
          )}
        >
          <i
            className={cs("fa-solid", "fa-angle-down", styles.collapseIcon)}
          ></i>
          <span className={cs(styles.providerName)}>
            <i
              className={cs(
                "fa-brands",
                `fa-${providerNameLowercase}`,
                styles.providerIcon
              )}
            ></i>
            {provider.name}
          </span>
        </label>
        <div className={cs(styles.providerContent)}>
          {hasPrs ? (
            <PrList
              prs={prs[providerNameLowercase] || []}
              provider={provider.name}
            />
          ) : (
            <div>
              <p>
                No PRs available. Try creating one at{" "}
                <a
                  href={provider.prHref || provider.baseHref}
                  target="_blank"
                  className={cs(
                    styles.noPrsLink,
                    styles[`${providerNameLowercase}Link`]
                  )}
                >
                  {provider.name}
                </a>
              </p>
            </div>
          )}
        </div>
      </section>
    );
  });
};

export default AllPrsList;
