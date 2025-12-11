// src/components/GithubWidget.jsx
import React, { useEffect, useState } from "react";
import "../App.css";

const USERNAME = "JAY-cloudbuster";

function GithubWidget() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchGithub = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${USERNAME}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("GitHub fetch error", err);
      }
    };

    fetchGithub();
  }, []);

  // derive a simple “score” from public repos + followers
  const score = data ? data.public_repos + data.followers : 0;

  return (
    <div className="github-card">
      <div className="github-card-header">
        <div className="github-card-logo">GH</div>
        <div className="github-card-title-block">
          <div className="github-card-name">
            {data?.name || "Loading GitHub…"}
          </div>
          <div className="github-card-username">@{USERNAME}</div>
        </div>
        <div className="github-card-id">
          #{data ? data.id : "------"}
        </div>
      </div>

      <div className="github-card-body">
        {/* Left circular score */}
        <div className="github-card-circle">
          <div className="github-card-circle-inner">
            <span className="github-card-score">
              {score}
            </span>
          </div>
        </div>

        {/* Right stats + bars */}
        <div className="github-card-stats">
          <div className="github-card-row">
            <span className="github-card-label">Repos</span>
            <span className="github-card-value">
              {data ? data.public_repos : "..."}
            </span>
          </div>
          <div className="github-card-bar github-card-bar-green">
            <div
              className="github-card-bar-fill"
              style={{
                width: data ? Math.min(data.public_repos * 4, 100) + "%" : "10%",
              }}
            />
          </div>

          <div className="github-card-row">
            <span className="github-card-label">Followers</span>
            <span className="github-card-value">
              {data ? data.followers : "..."}
            </span>
          </div>
          <div className="github-card-bar github-card-bar-yellow">
            <div
              className="github-card-bar-fill"
              style={{
                width: data ? Math.min(data.followers * 4, 100) + "%" : "5%",
              }}
            />
          </div>

          <div className="github-card-row">
            <span className="github-card-label">Following</span>
            <span className="github-card-value">
              {data ? data.following : "..."}
            </span>
          </div>
          <div className="github-card-bar github-card-bar-red">
            <div
              className="github-card-bar-fill"
              style={{
                width: data ? Math.min(data.following * 4, 100) + "%" : "5%",
              }}
            />
          </div>
        </div>
      </div>
      

      <a
        href={data?.html_url || "https://github.com/JAY-cloudbuster"}
        target="_blank"
        rel="noreferrer"
        className="github-card-link"
      >
        View on GitHub
      </a>
    </div>
  );
}

export default GithubWidget;