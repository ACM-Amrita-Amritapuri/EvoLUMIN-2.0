import { LINKS } from "../data.jsx";

export function Footer() {
  return (
    <footer id="contact">
      <div className="wrap fg">
        <div><h3>Evolumin</h3><p style={{ marginTop: 10 }}>Build. Evolve. Illuminate.</p></div>
        <nav aria-label="Footer"><h4>Explore</h4>{LINKS.map(([id, l]) => <a key={id} href={"#" + id}>{l}</a>)}</nav>
        <div><h4>Contact</h4><p>Contact details to be announced</p><p>Venue: to be announced</p></div>
        <div><h4>Follow</h4><p>Social links coming soon</p></div>
      </div>
      <div className="wrap"><p className="cp">© Evolumin Hackathon. All rights reserved.</p></div>
    </footer>
  );
}
