"use client";

import React from "react";
import { useActivitiesAnalytics } from "../../hook/useActivities"; // התאם את הנתיב במידת הצורך
import "./homeCrm.css";
import Loading from "./component/loading/loading";

export default function HomeCrm() {
  const {
    globalStatusData,
    isLoadingGlobalStatus,
    isErrorGlobalStatus,
    refetchGlobalStatus,
  } = useActivitiesAnalytics();

  // חילוץ הנתונים שהתקבלו מה-API
  const analytics = globalStatusData?.analytics || {
    totalLeads: 0,
    newLeads: 0,
    inProgressCount: 0,
    closedCount: 0,
  };

  return (
    <div className="home-container">
      {/* כותרת הדף */}
      <div className="home-header">
        <div>
          <h1 className="home-title">CRM Dashboard</h1>
          <p className="home-subtitle">Quick overview of your business</p>
        </div>
      </div>

      {/* 1. מצב טעינה */}
      {isLoadingGlobalStatus && <Loading></Loading>}

      {/* 2. מצב שגיאה */}
      {isErrorGlobalStatus && (
        <div className="analytics-status-box error">
          <span>Erro Facthing data</span>
          <button
            onClick={() => refetchGlobalStatus()}
            className="analytics-retry-btn"
          >
            Try again
          </button>
        </div>
      )}

      {/* 3. הצגת כרטיסיות האנליטיקה */}
      {!isLoadingGlobalStatus && !isErrorGlobalStatus && (
        <div className="analytics-grid">
          {/* סה"כ לידים */}
          <div className="analytics-card total">
            <div className="analytics-info">
              <p className="analytics-title">All leads </p>
              <h3 className="analytics-value">{analytics.totalLeads}</h3>
            </div>
            <div className="analytics-icon-wrapper">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>

          {/* לידים חדשים */}
          <div className="analytics-card new">
            <div className="analytics-info">
              <p className="analytics-title">New Leads</p>
              <h3 className="analytics-value">{analytics.newLeads}</h3>
            </div>
            <div className="analytics-icon-wrapper">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="16" y1="11" x2="22" y2="11" />
              </svg>
            </div>
          </div>

          {/* בתהליך */}
          <div className="analytics-card progress">
            <div className="analytics-info">
              <p className="analytics-title">In progress</p>
              <h3 className="analytics-value">{analytics.inProgressCount}</h3>
            </div>
            <div className="analytics-icon-wrapper">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>

          {/* סגורים */}
          <div className="analytics-card closed">
            <div className="analytics-info">
              <p className="analytics-title">closed</p>
              <h3 className="analytics-value">{analytics.closedCount}</h3>
            </div>
            <div className="analytics-icon-wrapper">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
