import { REGISTER_URL } from "../data.jsx";

export function Register() {
  return (
    <section className="sec" id="register"><div className="wrap reg">
      <div><div className="eb">Registration</div><h2>Ready to build<i className="blk" /></h2><p className="lead">Form a team of 2 to 4, pick a domain and register before the window closes. Late entries cannot be accepted.</p></div>
      <div className="regact"><a className="btn" href={REGISTER_URL}>Register your team</a><a className="btn ghost" href="mailto:hello@evolumin.example">Ask a question</a></div>
    </div></section>
  );
}
