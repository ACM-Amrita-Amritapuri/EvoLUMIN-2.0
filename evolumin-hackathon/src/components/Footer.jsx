import { LINKS } from "../data.jsx";

export function Footer() {
  return (
    <footer id="contact">
      <div className="wrap fg">
        <div><h3>Evolumin</h3><p style={{ marginTop: 10 }}>Build. Evolve. Illuminate.</p></div>
        <nav aria-label="Footer"><h4>Explore</h4>{LINKS.map(([id, l]) => <a key={id} href={"#" + id}>{l}</a>)}</nav>
        <div><h4>Contact</h4><a href="mailto:hello@evolumin.example">hello@evolumin.example</a><p>Coordinator, +91 00000 00000</p><p>Venue: to be announced</p></div>
        <div><h4>Follow</h4><a href="#">Instagram</a><a href="#">LinkedIn</a><a href="#">Discord</a></div>
      </div>
      <div className="wrap"><p className="cp">© Evolumin Hackathon. All rights reserved.</p></div>
    </footer>
  );
}
