const PrLineItem = ({ prDetails }) => {
  const { provider, linkAddress, prName, state } = prDetails;
  return (
    <li className={`${provider}`}>
      <a href={linkAddress} className={`${provider} ${state}`}>
        <strong>
          <span>{prName}</span>
        </strong>
      </a>
    </li>
  );
};

export default PrLineItem;
