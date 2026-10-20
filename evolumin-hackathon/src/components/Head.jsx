import "../styles/about.css";

// `eb` is accepted for compatibility but intentionally not rendered as a label.
export const Head = ({ title, lead }) => (
  <div className="ab-head"><h2 className="disp">{title}</h2>{lead && <p className="lead">{lead}</p>}</div>
);
