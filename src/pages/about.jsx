import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="pf-root">
      <main className="pf-wrap pf-section">
        <h1 className="pf-serif">About Me</h1>

        <p>I am Albert Cyriac, an MCA student specialising in NLP.</p>
        <p>I build applications using AI, machine learning and full-stack technologies.</p>
        <p>I enjoy turning ideas into simple and useful software.</p>

        <Link className="pf-link" to="/">
          ← Back
        </Link>
      </main>
    </div>
  );
}