import {useContext} from "react";
import cs from "classnames";
import PrList from "@psw/components/pr-list/pr-list";
import { usePollingEffect } from "@psw/hooks/polling";
import { OctokitContext } from "@psw/contexts/github";
import {getPrs} from "@psw/utils/github";
import styles from "./all-prs-list.module.scss";

const AllPrsList = ({ prs, setPrs }) => {
  const [githubContext, setGithubContext] = useContext(OctokitContext);
  const githubDataObject = {
    name: "Github",
    icon: "square-github",
    baseHref: "https://github.com",
    prHref: "https://github.com/pulls",
    username: githubContext.username,
    context: githubContext.context
  };
  const gitlabDataObject = {
    name: "Gitlab",
    icon: "square-gitlab",
    baseHref: "https://gitlab.com",
    username: '',
    context: null
  };
  const providers = [githubDataObject, gitlabDataObject];
  usePollingEffect(async ()=> {
    return await providers.map(async (provider) => {
      const providerName = provider.name.toLowerCase();
      if(providerName === 'github'){
        const fetchedPrs = await getPrs({ username: githubDataObject.username, octokit: githubDataObject.context});
        const prsByProvider = prs[providerName];
        const updatedPrs = fetchedPrs.map(newPr => {
          if(prsByProvider.filter(oldPr => { return oldPr.id !== newPr.id})){
            return newPr;
          } else {
            const currPr = prsByProvider.filter(oldPr => { return oldPr.id === newPr.id})[0];
            return {...currPr, ...newPr};
          }
        });
        return await setPrs({[providerName]: updatedPrs});
      }
    });
  },
  { interval: 300000 });
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
                  rel="noreferrer"
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
