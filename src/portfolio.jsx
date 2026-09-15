import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import "./portfolio.css";
import About from "./pages/about.jsx";

function PortfolioHome() {
  const [shown, setShown] = useState(false);
  const [theme, setTheme] = useState("light");

  const [appliedML, setAppliedML] = useState(null);
  const [appliedMLStatus, setAppliedMLStatus] = useState("loading");

  const [repos, setRepos] = useState(null);
  const [reposStatus, setReposStatus] = useState("loading");

  const [repoLog, setRepoLog] = useState({});

  const GITHUB_USER = "albertcyriac04-lgtm";


  // One-time entrance animation
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 40);

    return () => clearTimeout(t);
  }, []);


  // Load Applied ML projects
  useEffect(() => {
    fetch("/data/projects.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        return res.json();
      })
      .then((json) => {
        setAppliedML(json.appliedML);
        setAppliedMLStatus("ready");
      })
      .catch((err) => {
        console.error("Failed to load Applied ML data:", err);
        setAppliedMLStatus("error");
      });
  }, []);


  // Load GitHub repositories
  useEffect(() => {
    fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `GitHub API request failed: ${res.status}`
          );
        }

        return res.json();
      })
      .then((json) => {
        const list = json
          .filter((r) => !r.fork)
          .map((r) => ({
            name: r.name,
            description: r.description,
            url: r.html_url,
            language: r.language,
            topics: r.topics || [],
            stars: r.stargazers_count,
            updatedAt: r.updated_at,
          }));

        setRepos(list);
        setReposStatus("ready");


        // Load recent commits
        list.forEach((repo) => {
          fetch(
            `https://api.github.com/repos/${GITHUB_USER}/${repo.name}/commits?per_page=3`
          )
            .then((res) => {
              if (!res.ok) {
                throw new Error(
                  `GitHub API request failed: ${res.status}`
                );
              }

              return res.json();
            })
            .then((commits) => {
              const log = commits.map((c) => ({
                message: c.commit.message.split("\n")[0],
                date: c.commit.author.date,
                url: c.html_url,
              }));

              setRepoLog((prev) => ({
                ...prev,
                [repo.name]: log,
              }));
            })
            .catch((err) => {
              console.error(
                `Failed to load commit log for ${repo.name}:`,
                err
              );
            });
        });
      })
      .catch((err) => {
        console.error(
          "Failed to load repos from GitHub:",
          err
        );

        setReposStatus("error");
      });
  }, []);


  // Theme
  function toggleTheme() {
    setTheme((prev) =>
      prev === "light" ? "dark" : "light"
    );
  }


  return (
    <div className="pf-root" data-theme={theme}>

      {/* Header */}
      <header
        className="pf-wrap"
        style={{
          paddingTop: 40,
          paddingBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div
            className="pf-serif"
            style={{
              fontSize: "1.15rem",
              fontWeight: 600,
            }}
          >
            Albert Cyriac
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: "0.9rem",
              color: "var(--slate)",
            }}
          >
            <span>
              Kuttikkanam, Kerala ·{" "}
              <a
                className="pf-link"
                href="https://github.com/albertcyriac04-lgtm"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </span>

            {/* About link */}
            <Link
              className="pf-link"
              to="/about"
            >
              About
            </Link>

            {/* Theme button */}
            <button
              type="button"
              className="pf-theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light"
                ? "Dark mode"
                : "Light mode"}
            </button>
          </div>
        </div>
      </header>


      <hr className="pf-rule" />


      {/* Hero */}
      <section
        className={`pf-wrap pf-section pf-reveal ${
          shown ? "pf-shown" : ""
        }`}
      >
        <h1
          className="pf-serif"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
            fontWeight: 600,
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          I build systems that read, extract, and reason over real data.
        </h1>

        <p
          style={{
            marginTop: 20,
            maxWidth: "58ch",
            color: "var(--ink)",
          }}
        >
          Final-year MCA student specialising in NLP at Marian
          College Kuttikkanam, with a BSc in Mathematics behind it.
          Most of what I build sits at the intersection of the two:
          language models wired into retrieval pipelines, regression
          and classification models shipped as small usable apps,
          and full-stack platforms with a bit of ML holding the core
          feature together.
        </p>

        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 28,
            flexWrap: "wrap",
            fontSize: "0.9rem",
            color: "var(--slate)",
          }}
        >
          <span>
            <strong style={{ color: "var(--ink)" }}>
              7
            </strong>{" "}
            projects shipped
          </span>

          <span>
            <strong style={{ color: "var(--ink)" }}>
              5
            </strong>{" "}
            ML apps deployed
          </span>

          <span>
            <strong style={{ color: "var(--ink)" }}>
              2027
            </strong>{" "}
            graduation
          </span>
        </div>

        {/* Simple About link */}
        <div style={{ marginTop: 24 }}>
          <Link
            className="pf-link"
            to="/about"
          >
            About me →
          </Link>
        </div>
      </section>


      <hr className="pf-rule" />


      {/* Selected work */}
      <section className="pf-wrap pf-section">

        <h2
          className="pf-serif"
          style={{
            fontSize: "1.4rem",
            fontWeight: 600,
            margin: "0 0 32px",
          }}
        >
          Selected work
        </h2>


        {reposStatus === "loading" && (
          <p style={{ color: "var(--slate)" }}>
            Loading repositories from GitHub…
          </p>
        )}


        {reposStatus === "error" && (
          <p style={{ color: "var(--slate)" }}>
            Couldn't load repositories from GitHub.
            Try refreshing in a bit.
          </p>
        )}


        {reposStatus === "ready" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 40,
            }}
          >
            {repos.map((r) => (
              <article key={r.name}>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 12,
                  }}
                >
                  <h3
                    className="pf-serif"
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {r.name}
                  </h3>

                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--slate)",
                    }}
                  >
                    {new Date(r.updatedAt).getFullYear()}
                  </span>
                </div>


                <p
                  style={{
                    marginTop: 12,
                    maxWidth: "62ch",
                  }}
                >
                  {r.description ||
                    "No description set on this repository yet."}
                </p>


                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 14,
                  }}
                >
                  {r.language && (
                    <span className="pf-tag">
                      {r.language}
                    </span>
                  )}

                  {r.topics.map((t) => (
                    <span
                      className="pf-tag"
                      key={t}
                    >
                      {t}
                    </span>
                  ))}
                </div>


                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--slate)",
                    marginTop: 10,
                  }}
                >
                  ★ {r.stars} on GitHub · updated{" "}
                  {new Date(
                    r.updatedAt
                  ).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </div>


                {/* Commit log */}
                {repoLog[r.name] &&
                  repoLog[r.name].length > 0 && (
                    <ul
                      style={{
                        listStyle: "none",
                        margin: "10px 0 0",
                        padding: 0,
                        borderLeft:
                          "2px solid var(--line)",
                      }}
                    >
                      {repoLog[r.name].map((c) => (
                        <li
                          key={c.url}
                          style={{
                            padding:
                              "2px 0 2px 12px",
                            fontSize: "0.82rem",
                          }}
                        >
                          <a
                            className="pf-link"
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {c.message}
                          </a>

                          <span
                            style={{
                              color: "var(--slate)",
                            }}
                          >
                            {" "}
                            ·{" "}
                            {new Date(
                              c.date
                            ).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}


                <div
                  style={{
                    marginTop: 14,
                    fontSize: "0.9rem",
                  }}
                >
                  <a
                    className="pf-link"
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on GitHub
                  </a>
                </div>

              </article>
            ))}
          </div>
        )}
      </section>


      <hr className="pf-rule" />


      {/* Applied ML */}
      <section className="pf-wrap pf-section">

        <h2
          className="pf-serif"
          style={{
            fontSize: "1.4rem",
            fontWeight: 600,
            margin: "0 0 8px",
          }}
        >
          Applied ML, one model at a time
        </h2>

        <p
          style={{
            color: "var(--slate)",
            marginTop: 0,
            marginBottom: 28,
            maxWidth: "58ch",
          }}
        >
          Five small regression and classification models,
          each built to isolate one algorithm and shipped as
          its own working app rather than left in a notebook.
        </p>


        {appliedMLStatus === "loading" && (
          <p style={{ color: "var(--slate)" }}>
            Loading…
          </p>
        )}


        {appliedMLStatus === "error" && (
          <p style={{ color: "var(--slate)" }}>
            Couldn't load this data. Check that
            /data/projects.json exists in your public folder.
          </p>
        )}


        {appliedMLStatus === "ready" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {appliedML.map((a, i) => (
              <a
                key={a.name}
                href={a.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 0",
                  borderTop:
                    i === 0
                      ? "1px solid var(--line)"
                      : "none",
                  borderBottom:
                    "1px solid var(--line)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    {a.name}
                  </div>

                  <div
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--slate)",
                      marginTop: 2,
                      maxWidth: "50ch",
                    }}
                  >
                    {a.desc}
                  </div>
                </div>

                <span
                  className="pf-link"
                  style={{
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  View live
                </span>
              </a>
            ))}
          </div>
        )}
      </section>


      <hr className="pf-rule" />


      {/* Background */}
      <section className="pf-wrap pf-section">

        <h2
          className="pf-serif"
          style={{
            fontSize: "1.4rem",
            fontWeight: 600,
            margin: "0 0 24px",
          }}
        >
          Background
        </h2>


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 32,
          }}
        >

          <div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--slate)",
                marginBottom: 8,
              }}
            >
              Education
            </div>

            <div>
              MCA, specialising in NLP
            </div>

            <div
              style={{
                color: "var(--slate)",
                fontSize: "0.9rem",
              }}
            >
              Marian College Kuttikkanam · MG University · 2027
            </div>

            <div style={{ marginTop: 8 }}>
              BSc Mathematics
            </div>

            <div
              style={{
                color: "var(--slate)",
                fontSize: "0.9rem",
              }}
            >
              St. Thomas College, Palai
            </div>
          </div>


          <div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--slate)",
                marginBottom: 8,
              }}
            >
              Stack
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {[
                "Python",
                "JavaScript",
                "Java",
                "SQL",
                "Django",
                "React",
                "Scikit-learn",
                "AWS",
                "Vercel",
              ].map((s) => (
                <span
                  className="pf-tag"
                  key={s}
                >
                  {s}
                </span>
              ))}
            </div>


            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--slate)",
                margin: "16px 0 8px",
              }}
            >
              Grounded in
            </div>

            <div
              style={{
                color: "var(--ink)",
                fontSize: "0.95rem",
              }}
            >
              Operations research, NLP, and ML model
              evaluation — the math side of the
              math-and-code combination.
            </div>
          </div>

        </div>
      </section>


      <hr className="pf-rule" />


      {/* Contact */}
      <section
        className="pf-wrap pf-section"
        style={{
          paddingBottom: 64,
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <span className="pf-status-dot" />

          <span
            style={{
              fontSize: "0.9rem",
              color: "var(--slate)",
            }}
          >
            Open to AI/ML internships from late 2026 ·
            remote or on-site
          </span>
        </div>


        <h2
          className="pf-serif"
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            margin: "0 0 16px",
          }}
        >
          Get in touch
        </h2>


        <p
          style={{
            maxWidth: "50ch",
            marginBottom: 20,
          }}
        >
          The fastest way to see more of my work is GitHub.
          For anything else, reach me by email.
        </p>


        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            fontSize: "0.95rem",
          }}
        >
          <a
            className="pf-link"
            href="https://github.com/albertcyriac04-lgtm"
            target="_blank"
            rel="noreferrer"
          >
            github.com/albertcyriac04-lgtm
          </a>

          <a
            className="pf-link"
            href="mailto:albertcyriac04@gmail.com"
          >
            albertcyriac04@gmail.com
          </a>
        </div>

      </section>

    </div>
  );
}


/*
  Router
*/
export default function Portfolio() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<PortfolioHome />}
        />

        <Route
          path="/about"
          element={<About />}
        />

      </Routes>
    </BrowserRouter>
  );
}