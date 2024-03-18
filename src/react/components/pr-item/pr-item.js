import { useEffect, useContext, useState } from "react";
import cs from "classnames";
import { OctokitContext } from "../../contexts/octokit";
import styles from "./pr-item.module.scss";

const PrLineItem = ({ prDetails }) => {
  const {
    provider,
    linkAddress,
    prName,
    prNumber,
    state,
    isDraft,
    owner,
    repository,
  } = prDetails;
  const [octokitContext, setOctokitContext] = useContext(OctokitContext);
  const [mergeableState, setMergeableState] = useState("");
  const [prId, setPrId] = useState();
  useEffect(() => {
    if (repository && owner && prNumber && mergeableState.length <= 0) {
      return async () => {
        const prDataResponse = await octokitContext.request(
          "GET /repos/{owner}/{repo}/pulls/{pull_number}",
          {
            owner: repository.owner,
            repo: repository.name,
            pull_number: prNumber,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );

        const prData = prDataResponse.data;
        setMergeableState(prData.mergeable_state);
        setPrId(prData.id);
      };
    }
  }, [repository, owner, prNumber, setMergeableState, setPrId, mergeableState]);

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
      <a href={owner.url} className={cs(styles.prOwner)}>
        {owner.name}
      </a>
    </li>
  );
};

export default PrLineItem;
