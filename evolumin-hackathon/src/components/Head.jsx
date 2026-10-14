
export const Head = ({ eb, title, lead }) => (
  <div className="sh"><div><div className="eb">{eb}</div><h2>{title}</h2></div>{lead && <p className="lead">{lead}</p>}</div>
);
