import { useContext } from "react";
import cs from "classnames";
import PrList from "@psw/components/pr-list/pr-list";
import GitlabLoginButton from "@psw/components/sign-in-buttons/gitlab-login-button";
import GithubLoginButton from "@psw/components/sign-in-buttons/github-login-button";
import { usePollingEffect } from "@psw/hooks/polling";
import { OctokitContext, GitlabUserContext } from "@psw/contexts";
import { getGithubPrs } from "@psw/utils/github";
import { getGitlabPrs } from "@psw/utils/gitlab";
import styles from "./all-prs-list.module.scss";

const AllPrsList = ({ prs }) => {
  const [githubContext, setGithubContext] = useContext(OctokitContext);
  const [gitlabUserContext, setGitlabUserContext] =
    useContext(GitlabUserContext);
  const githubDataObject = {
    name: "Github",
    icon: "square-github",
    baseHref: "https://github.com",
    prHref: "https://github.com/pulls",
    username: githubContext.username,
    context: githubContext.context,
    prs: prs.current.github || [],
    loginBtn: (
      <GithubLoginButton
        prs={prs}
        classes={cs(styles.loginBtn, styles.githubLoginBtn)}
      />
    )
  };
  const gitlabDataObject = {
    name: "Gitlab",
    icon: "square-gitlab",
    baseHref: "https://gitlab.com",
    prHref: "",
    username: gitlabUserContext.username,
    context: null,
    prs: prs.current.gitlab || [],
    loginBtn: (
      <GitlabLoginButton
        prs={prs}
        classes={cs(styles.loginBtn, styles.gitlabLoginBtn)}
      />
    )
  };
  const providers = [githubDataObject, gitlabDataObject];

  usePollingEffect(
    async () => {
      return await Promise.all(
        providers.map(async (provider) => {
          const providerName = provider.name.toLowerCase();
          if (providerName === "github" && prs.current[providerName]) {
            const fetchedPrs = await getGithubPrs({
              username: githubDataObject.username,
              octokit: githubDataObject.context,
              isUpdate: true
            });
            const prsByProvider = prs.current[providerName];
            const updatedPrs = fetchedPrs.map((newPr) => {
              if (
                prsByProvider.filter((oldPr) => {
                  return oldPr.id !== newPr.id;
                })
              ) {
                return newPr;
              } else {
                const currPr = prsByProvider.filter((oldPr) => {
                  return oldPr.id === newPr.id;
                })[0];
                return { ...currPr, ...newPr };
              }
            });
            const updatedPrsObj = {
              ...prs.current,
              [providerName]: updatedPrs
            };
            prs.current = updatedPrsObj;
          } else if(providerName === "gitlab" && prs.current[providerName]){
            const fetchedPrs = await getGitlabPrs({
              username: gitlabDataObject.username,
              authToken: gitlabUserContext.authToken,
              isUpdate: true
            });
            const prsByProvider = prs.current[providerName];
            const updatedPrs = fetchedPrs.map((newPr) => {
              if (
                prsByProvider.filter((oldPr) => {
                  return oldPr.id !== newPr.id;
                })
              ) {
                return newPr;
              } else {
                const currPr = prsByProvider.filter((oldPr) => {
                  return oldPr.id === newPr.id;
                })[0];
                return { ...currPr, ...newPr };
              }
            });
            const updatedPrsObj = {
              ...prs.current,
              [providerName]: updatedPrs
            };
            prs.current = updatedPrsObj;
          }
        })
      );
    },
    { interval: 10000 }
  );
  return providers.map((provider) => {
    const providerNameLowercase = provider.name.toLowerCase();
    const hasPrs = provider.prs.length > 0;
    const additionalLoginProviders = providers.filter((currentProvider) => {
      return currentProvider.name.toLowerCase() !== providerNameLowercase;
    });
    const showLoginBtn =
      additionalLoginProviders.length > 0 && provider.username === undefined;
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
            <PrList prs={provider.prs || []} provider={provider.name} />
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
          {showLoginBtn && provider.loginBtn}
        </div>
      </section>
    );
  });
};

export default AllPrsList;
