"use client";

import React from "react";
import { useActivitiesAnalytics } from "../../hook/useActivities";
import { useSales } from "../../hook/useSales";
import Loading from "./component/loading/loading";

import "./homeCrm.css";

// Import and register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function HomeCrm() {
  const {
    globalStatusData,
    isLoadingGlobalStatus,
    isErrorGlobalStatus,
    refetchGlobalStatus,
  } = useActivitiesAnalytics();

  const { sales, isLoadingSales, isErrorSales } = useSales();

  const isLoading = isLoadingGlobalStatus || isLoadingSales;
  const isError = isErrorGlobalStatus || isErrorSales;

  // Extract lead analytics
  const analytics = globalStatusData?.analytics || {
    totalLeads: 0,
    newLeads: 0,
    inProgressCount: 0,
    closedCount: 0,
  };

  // Extract sales analytics
  const salesAnalytics = sales?.analytics || {
    total: { count: 0, totalAmount: 0 },
    thisMonth: { count: 0, totalAmount: 0 },
    lastMonth: { count: 0, totalAmount: 0 },
    difference: { amount: 0, percentage: 0 },
  };

  // 1. Weekly Sales Chart Data
  const weeklyData = salesAnalytics.weeklySales || [
    salesAnalytics.thisMonth.totalAmount * 0.2,
    salesAnalytics.thisMonth.totalAmount * 0.35,
    salesAnalytics.thisMonth.totalAmount * 0.25,
    salesAnalytics.thisMonth.totalAmount * 0.2,
  ];

  const weeklyChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Revenue ($)",
        data: weeklyData,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(59, 130, 246, 0.95)");
          gradient.addColorStop(1, "rgba(147, 197, 253, 0.4)");
          return gradient;
        },
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // 2. Monthly Sales Chart Data
  const monthlyData = salesAnalytics.monthlySales || [
    salesAnalytics.lastMonth.totalAmount,
    salesAnalytics.thisMonth.totalAmount,
  ];

  const monthlyLabels = salesAnalytics.monthlyLabels || [
    "Last Month",
    "This Month",
  ];

  const monthlyChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Revenue ($)",
        data: monthlyData,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.95)");
          gradient.addColorStop(1, "rgba(110, 231, 183, 0.4)");
          return gradient;
        },
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const createChartOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: titleText,
        align: "start",
        color: "#1f2937",
        font: { size: 16, weight: "700", family: "system-ui" },
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleFont: { size: 13 },
        bodyFont: { size: 14, weight: "bold" },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `$${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#f3f4f6" },
        border: { dash: [4, 4] },
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  });

  const isPositiveGrowth = salesAnalytics.difference.percentage >= 0;

  return (
    <div className="home-container">
      {/* Page Header */}
      <header className="home-header">
        <div>
          <h1 className="home-title"> Dashboard</h1>
          <p className="home-subtitle">
            Real-time overview of your business performance
          </p>
        </div>
      </header>

      {/* 1. Loading State */}
      {isLoading && (
        <div className="loading-wrapper">
          <Loading />
        </div>
      )}

      {/* 2. Error State */}
      {isError && (
        <div className="analytics-status-box error">
          <div className="error-content">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="error-icon"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Failed to load analytics data</span>
          </div>
          <button
            onClick={() => refetchGlobalStatus()}
            className="analytics-retry-btn"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Key Metrics – Sales */}
          <section className="analytics-section">
            <h2 className="section-title">Sales view</h2>
            <div className="analytics-grid">
              <div className="analytics-card closed">
                <div className="analytics-card-header">
                  <p className="analytics-title">Total Sales</p>
                  <div className="analytics-icon-wrapper">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                </div>
                <div className="analytics-body">
                  <h3 className="analytics-value">
                    ${salesAnalytics.total.totalAmount.toLocaleString()}
                  </h3>
                  <span className="analytics-subtitle">
                    {salesAnalytics.total.count} deals closed
                  </span>
                </div>
              </div>

              <div className="analytics-card total">
                <div className="analytics-card-header">
                  <p className="analytics-title">This Months Sales</p>
                  <div className="analytics-icon-wrapper">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                </div>
                <div className="analytics-body">
                  <h3 className="analytics-value">
                    ${salesAnalytics.thisMonth.totalAmount.toLocaleString()}
                  </h3>
                  <span className="analytics-subtitle">
                    {salesAnalytics.thisMonth.count} deals this month
                  </span>
                </div>
              </div>

              <div className="analytics-card progress">
                <div className="analytics-card-header">
                  <p className="analytics-title">Last Months Sales</p>
                  <div className="analytics-icon-wrapper">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 8 8 12 12 16" />
                      <line x1="16" y1="12" x2="8" y2="12" />
                    </svg>
                  </div>
                </div>
                <div className="analytics-body">
                  <h3 className="analytics-value">
                    ${salesAnalytics.lastMonth.totalAmount.toLocaleString()}
                  </h3>
                  <span className="analytics-subtitle">
                    {salesAnalytics.lastMonth.count} deals last month
                  </span>
                </div>
              </div>

              <div className="analytics-card new">
                <div className="analytics-card-header">
                  <p className="analytics-title">Monthly Growth</p>
                  <div className="analytics-icon-wrapper">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                  </div>
                </div>
                <div className="analytics-body">
                  <div className="value-badge-wrapper">
                    <h3 className="analytics-value">
                      {isPositiveGrowth ? "+" : ""}
                      {salesAnalytics.difference.percentage}%
                    </h3>
                    <span
                      className={`growth-badge ${isPositiveGrowth ? "positive" : "negative"}`}
                    >
                      {isPositiveGrowth ? "↑" : "↓"}{" "}
                      {salesAnalytics.difference.amount >= 0 ? "+" : ""}$
                      {salesAnalytics.difference.amount.toLocaleString()}
                    </span>
                  </div>
                  <span className="analytics-subtitle">vs. previous month</span>
                </div>
              </div>
            </div>
          </section>

          {/* Key Metrics – Leads */}
          <section className="analytics-section">
            <h2 className="section-title">Lead Status</h2>
            <div className="analytics-grid triple">
              <div className="analytics-card total">
                <div className="analytics-card-header">
                  <p className="analytics-title">Total Leads</p>
                  <div className="analytics-icon-wrapper">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                </div>
                <div className="analytics-body">
                  <h3 className="analytics-value">{analytics.totalLeads}</h3>
                  <span className="analytics-subtitle">
                    Registered in system
                  </span>
                </div>
              </div>

              <div className="analytics-card new">
                <div className="analytics-card-header">
                  <p className="analytics-title">New Leads</p>
                  <div className="analytics-icon-wrapper">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="16" y1="11" x2="22" y2="11" />
                    </svg>
                  </div>
                </div>
                <div className="analytics-body">
                  <h3 className="analytics-value">{analytics.newLeads}</h3>
                  <span className="analytics-subtitle">Awaiting action</span>
                </div>
              </div>

              <div className="analytics-card progress">
                <div className="analytics-card-header">
                  <p className="analytics-title">In Progress</p>
                  <div className="analytics-icon-wrapper">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                </div>
                <div className="analytics-body">
                  <h3 className="analytics-value">
                    {analytics.inProgressCount}
                  </h3>
                  <span className="analytics-subtitle">Active follow-ups</span>
                </div>
              </div>
            </div>
          </section>

          {/* Charts Section */}
          <section className="charts-grid-wrapper">
            <div className="chart-container-box">
              <Bar
                data={weeklyChartData}
                options={createChartOptions(
                  "Weekly Sales Breakdown (Current Month)",
                )}
              />
            </div>
            <div className="chart-container-box">
              <Bar
                data={monthlyChartData}
                options={createChartOptions("Monthly Sales Comparison")}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
