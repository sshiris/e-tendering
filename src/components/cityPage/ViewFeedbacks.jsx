import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewFeedbacks.css";

const ViewFeedbacks = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [filter, setFilter] = useState("all");
  const API_URL = "http://localhost:5500";

  useEffect(() => {
    const fetchAllFeedback = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/feedback`);
        setFeedbackList(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch feedback. Please try again.");
        setLoading(false);
      }
    };

    fetchAllFeedback();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (name) => {
    if (!name || name === "Anonymous") return "A";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSortedFeedback = () => {
    let sorted = [...feedbackList];

    if (filter !== "all") {
      sorted = sorted.filter((item) => item.category === filter);
    }

    if (sortBy === "newest") {
      return sorted.sort(
        (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
      );
    } else if (sortBy === "oldest") {
      return sorted.sort(
        (a, b) => new Date(a.date || 0) - new Date(b.date || 0)
      );
    } else if (sortBy === "popular") {
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    return sorted;
  };

  const categories = [
    "all",
    ...new Set(feedbackList.filter((f) => f.category).map((f) => f.category)),
  ];

  const sortedFeedback = getSortedFeedback();

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h1>Feedback Feed</h1>
        <div className="feedback-controls">
          <select
            className="feedback-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </select>

          <select
            className="feedback-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="feedback-error">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="feedback-loading">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <span>Loading feedback...</span>
        </div>
      ) : sortedFeedback.length === 0 ? (
        <div className="feedback-empty">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
          </div>
          <p className="empty-text">No feedback has been submitted yet.</p>
          <p className="empty-subtext">
            Check back later or adjust your filters.
          </p>
        </div>
      ) : (
        <div className="feedback-list">
          {sortedFeedback.map((feedback, index) => (
            <div key={index} className="feedback-card">
              <div className="feedback-content">
                <div
                  className="feedback-avatar"
                  style={{
                    backgroundColor: getRandomColor(feedback.user_name),
                  }}
                >
                  {getInitials(feedback.user_name)}
                </div>

                <div className="feedback-body">
                  <div className="feedback-meta">
                    <h3 className="feedback-author">
                      {feedback.user_name || "Anonymous"}
                    </h3>
                    <span className="feedback-separator">•</span>
                    <span className="feedback-date">
                      {feedback.date ? formatDate(feedback.date) : "Recently"}
                    </span>

                    {feedback.verified && (
                      <span className="feedback-badge verified">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="feedback-message">{feedback.message}</p>

                  <div className="feedback-tags">
                    {feedback.category && (
                      <span className="feedback-tag category">
                        {feedback.category}
                      </span>
                    )}

                    {feedback.sentiment && (
                      <span
                        className={`feedback-tag sentiment ${feedback.sentiment}`}
                      >
                        {feedback.sentiment}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedFeedback.length > 0 && (
        <div className="feedback-pagination">
          <button className="pagination-button prev">Previous</button>
          <button className="pagination-button next">Next</button>
        </div>
      )}
    </div>
  );
};

function getRandomColor(name) {
  const colors = [
    "#4299E1",
    "#F56565",
    "#48BB78",
    "#ECC94B",
    "#9F7AEA",
    "#ED64A6",
    "#667EEA",
    "#38B2AC",
  ];

  const index = name ? name.charCodeAt(0) % colors.length : 0;
  return colors[index];
}

export default ViewFeedbacks;
