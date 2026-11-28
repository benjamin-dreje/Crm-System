"use client";

import React, { useMemo, useState } from "react";
import { useActivitiesAnalytics } from "../../hook/useActivities";
import { useSales } from "../../hook/useSales";
import Loading from "./component/loading/loading";

import "./homeCrm.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Filler,
  Tooltip,
  Legend,
);

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const EMPTY_TRENDS = [];

function getUtcDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getStartOfCurrentMonth() {
  const now = new Date();
  return getUtcDateKey(
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
  );
}

function buildSalesTrendFallback(sales) {
  const salesByDate = new Map();

  sales.forEach((sale) => {
    const saleDate = new Date(sale.createdAt || sale.saleDate);
    if (Number.isNaN(saleDate.getTime())) return;

    const date = getUtcDateKey(saleDate);
    salesByDate.set(
      date,
      (salesByDate.get(date) || 0) + (Number(sale.amount) || 0),
    );
  });

  return [...salesByDate.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([date, amount]) => ({ date, sales: amount, leads: 0 }));
}

function buildTrendChartData(trends, startDate, endDate, hasLeadHistory) {
  const selectedTrends = trends.filter(
    ({ date }) => date >= startDate && date <= endDate,
  );
  const rangeLength =
    (new Date(`${endDate}T00:00:00Z`) - new Date(`${startDate}T00:00:00Z`)) /
    DAY_IN_MILLISECONDS;
  const grouping =
    rangeLength > 150 ? "month" : rangeLength > 45 ? "week" : "day";
  const buckets = new Map();

  selectedTrends.forEach((trend) => {
    let bucketKey = trend.date;

    if (grouping === "month") {
      bucketKey = trend.date.slice(0, 7);
    } else if (grouping === "week") {
      const weekStart = new Date(`${trend.date}T00:00:00Z`);
      const daysSinceMonday = (weekStart.getUTCDay() + 6) % 7;
      weekStart.setUTCDate(weekStart.getUTCDate() - daysSinceMonday);
      bucketKey = getUtcDateKey(weekStart);
    }

    const bucket = buckets.get(bucketKey) || { sales: 0, leads: 0 };
    bucket.sales += Number(trend.sales) || 0;
    bucket.leads += Number(trend.leads) || 0;
    buckets.set(bucketKey, bucket);
  });

  const sortedBuckets = [...buckets.entries()].sort(([first], [second]) =>
    first.localeCompare(second),
  );
  const includesMultipleYears = startDate.slice(0, 4) !== endDate.slice(0, 4);

  const labels = sortedBuckets.map(([key]) => {
    const dateKey = grouping === "month" ? `${key}-01` : key;
    const date = new Date(`${dateKey}T12:00:00Z`);

    return date.toLocaleDateString(
      "en-US",
      grouping === "month"
        ? { month: "short", ...(includesMultipleYears && { year: "numeric" }) }
        : {
            month: "short",
            day: "numeric",
            ...(includesMultipleYears && { year: "2-digit" }),
          },
    );
  });

  const datasets = [
    {
      label: "Sales ($)",
      data: sortedBuckets.map(([, bucket]) => bucket.sales),
      yAxisID: "sales",
      borderColor: "#3b82f6",
      backgroundColor: (context) => {
        const { ctx, chartArea } = context.chart;
        if (!chartArea) return "rgba(59, 130, 246, 0.12)";

        const gradient = ctx.createLinearGradient(
          0,
          chartArea.top,
          0,
          chartArea.bottom,
        );
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 0.02)");
        return gradient;
      },
      fill: true,
      tension: 0.38,
      borderWidth: 3,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: "#ffffff",
      pointBorderColor: "#3b82f6",
      pointBorderWidth: 2,
    },
  ];

  if (hasLeadHistory) {
    datasets.push({
      label: "Leads",
      data: sortedBuckets.map(([, bucket]) => bucket.leads),
      yAxisID: "leads",
      borderColor: "#54b8aa",
      backgroundColor: "#54b8aa",
      fill: false,
      tension: 0.38,
      borderWidth: 3,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: "#54b8aa",
      pointBorderWidth: 0,
    });
  }

  return {
    labels,
    datasets,
  };
}

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

export default function HomeCrm() {
  const {
    globalStatusData,
    isLoadingGlobalStatus,
    isErrorGlobalStatus,
    refetchGlobalStatus,
  } = useActivitiesAnalytics();
  const { sales, isLoadingSales, isErrorSales, error: salesError } = useSales();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [customStartDate, setCustomStartDate] = useState(
    getStartOfCurrentMonth,
  );
  const [customEndDate, setCustomEndDate] = useState(() =>
    getUtcDateKey(new Date()),
  );

  const isLoading = isLoadingGlobalStatus || isLoadingSales;
  const analytics = globalStatusData?.analytics || {
    totalLeads: 0,
    newLeads: 0,
    inProgressCount: 0,
  };
  const salesAnalytics = sales?.analytics || {
    total: { count: 0, totalAmount: 0 },
    thisMonth: { count: 0, totalAmount: 0 },
    lastMonth: { count: 0, totalAmount: 0 },
    difference: { amount: 0, percentage: 0 },
  };
  const trends = globalStatusData?.trends || EMPTY_TRENDS;
  const salesRows = sales?.allSales || EMPTY_TRENDS;
  const hasLeadHistory = trends.length > 0;
  const salesTrend = useMemo(
    () => buildSalesTrendFallback(salesRows),
    [salesRows],
  );
  const chartTrends = hasLeadHistory ? trends : salesTrend;
  const latestTrendDate =
    trends[trends.length - 1]?.date || getUtcDateKey(new Date());
  const earliestTrendDate = chartTrends[0]?.date || getStartOfCurrentMonth();

  const selectedDateRange = useMemo(() => {
    if (selectedPeriod === "custom") {
      return { start: customStartDate, end: customEndDate };
    }

    const now = new Date();
    const monthsBack =
      selectedPeriod === "sixMonths"
        ? 5
        : selectedPeriod === "threeMonths"
          ? 2
          : 0;
    return {
      start: getUtcDateKey(
        new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsBack, 1),
        ),
      ),
      end: latestTrendDate,
    };
  }, [selectedPeriod, customStartDate, customEndDate, latestTrendDate]);

  const trendChartData = useMemo(
    () =>
      buildTrendChartData(
        chartTrends,
        selectedDateRange.start,
        selectedDateRange.end,
        hasLeadHistory,
      ),
    [chartTrends, selectedDateRange, hasLeadHistory],
  );
  const hasChartActivity = trendChartData.datasets.some((dataset) =>
    dataset.data.some((value) => Number(value) > 0),
  );

  const trendChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      layout: { padding: { top: 4, right: 4 } },
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
            color: "#334155",
            padding: 18,
            font: { size: 12, weight: "600" },
          },
        },
        tooltip: {
          backgroundColor: "#172033",
          titleFont: { size: 12, weight: "600" },
          bodyFont: { size: 13, weight: "600" },
          padding: 11,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: (context) =>
              context.dataset.yAxisID === "sales"
                ? ` Sales: ${formatCurrency(context.parsed.y)}`
                : ` Leads: ${context.parsed.y.toLocaleString("en-US")}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(148, 163, 184, 0.12)" },
          border: { display: false },
          ticks: {
            color: "#64748b",
            maxTicksLimit: 12,
            maxRotation: 0,
            autoSkip: true,
            font: { size: 11 },
          },
        },
        sales: {
          type: "linear",
          position: "left",
          beginAtZero: true,
          border: { display: false },
          grid: { color: "rgba(148, 163, 184, 0.16)", drawTicks: false },
          ticks: {
            color: "#64748b",
            padding: 10,
            maxTicksLimit: 5,
            callback: (value) => {
              const amount = Number(value);
              return amount >= 1000
                ? `$${(amount / 1000).toLocaleString("en-US")}k`
                : formatCurrency(amount);
            },
            font: { size: 11 },
          },
        },
        leads: {
          display: hasLeadHistory,
          type: "linear",
          position: "right",
          beginAtZero: true,
          border: { display: false },
          grid: { drawOnChartArea: false },
          ticks: {
            color: "#64748b",
            padding: 10,
            maxTicksLimit: 5,
            precision: 0,
            font: { size: 11 },
          },
        },
      },
    }),
    [hasLeadHistory],
  );

  const isPositiveGrowth = salesAnalytics.difference.percentage >= 0;
  const growthAmount = Number(salesAnalytics.difference.amount) || 0;
  const trendRangeStart = chartTrends[0]?.date || earliestTrendDate;

  return (
    <div className="home-container">
      <header className="home-header">
        <div>
          <h1 className="home-title">Dashboard</h1>
          <p className="home-subtitle">
            Real-time overview of your business performance
          </p>
        </div>
        <div className="dashboard-header-actions">
          <button
            type="button"
            className="dashboard-period-btn"
            onClick={() => setSelectedPeriod("month")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Current Month
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="dashboard-export-btn"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>

          <span
            className="dashboard-avatar"
            role="img"
            aria-label="User profile"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>
          </span>
        </div>
      </header>

      {isLoading && (
        <div className="loading-wrapper">
          <Loading />
        </div>
      )}

      {isErrorGlobalStatus && (
        <div className="analytics-status-box error">
          <div className="error-content">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="error-icon"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Failed to load dashboard analytics</span>
          </div>
          <button
            onClick={() => refetchGlobalStatus()}
            className="analytics-retry-btn"
            type="button"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isErrorGlobalStatus && (
        <>
          <section className="dashboard-overview-section">
            <h2 className="section-title">Sales View</h2>
            <div className="dashboard-overview-grid">
              <div className="analytics-card closed sales-total-card">
                <div className="analytics-card-header">
                  <p className="analytics-title">Total Sales</p>
                  <div className="analytics-icon-wrapper">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                </div>
                {isErrorSales ? (
                  <p className="sales-card-error">
                    {salesError?.message || "Unable to load sales data"}
                  </p>
                ) : (
                  <>
                    <div className="analytics-body">
                      <h3 className="analytics-value">
                        {formatCurrency(salesAnalytics.total.totalAmount)}
                      </h3>
                      <span className="analytics-subtitle">
                        {salesAnalytics.total.count} deals closed
                      </span>
                    </div>
                    <svg
                      className="sales-safe-illustration"
                      viewBox="0 0 180 150"
                      fill="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient
                          id="safe-body"
                          x1="26"
                          y1="43"
                          x2="153"
                          y2="125"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#49D5F5" />
                          <stop offset=".52" stopColor="#3979ED" />
                          <stop offset="1" stopColor="#7547D8" />
                        </linearGradient>
                        <linearGradient
                          id="safe-side"
                          x1="146"
                          y1="61"
                          x2="167"
                          y2="120"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#7453EB" />
                          <stop offset="1" stopColor="#4930B7" />
                        </linearGradient>
                        <radialGradient
                          id="safe-dial"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientTransform="matrix(0 28 -28 0 89 87)"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#65E6FF" />
                          <stop offset=".58" stopColor="#2696F4" />
                          <stop offset="1" stopColor="#4139C4" />
                        </radialGradient>
                      </defs>
                      <path
                        d="M67 28v-9a7 7 0 0 1 7-7h34a7 7 0 0 1 7 7v9"
                        stroke="#4969E5"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      <path
                        d="m31 43 114 8 19 13v59l-19 10-114-8V43Z"
                        fill="url(#safe-side)"
                      />
                      <rect
                        x="18"
                        y="39"
                        width="127"
                        height="87"
                        rx="13"
                        fill="url(#safe-body)"
                        stroke="#8EEBFF"
                        strokeWidth="3"
                      />
                      <rect
                        x="29"
                        y="50"
                        width="105"
                        height="65"
                        rx="8"
                        fill="#173DAB"
                        fillOpacity=".42"
                        stroke="#72DFFF"
                        strokeOpacity=".7"
                        strokeWidth="2"
                      />
                      <rect
                        x="23"
                        y="67"
                        width="7"
                        height="19"
                        rx="3.5"
                        fill="#9AF3FF"
                      />
                      <rect
                        x="133"
                        y="67"
                        width="7"
                        height="19"
                        rx="3.5"
                        fill="#9AF3FF"
                      />
                      <circle
                        cx="82"
                        cy="83"
                        r="27"
                        fill="#163CB0"
                        fillOpacity=".55"
                        stroke="#71E6FF"
                        strokeWidth="3"
                      />
                      <circle
                        cx="82"
                        cy="83"
                        r="17"
                        fill="url(#safe-dial)"
                        stroke="#A3F4FF"
                        strokeWidth="2"
                      />
                      <circle cx="82" cy="83" r="4" fill="#D9FCFF" />
                      <path
                        d="M82 83 92 75"
                        stroke="#E4FDFF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </>
                )}
              </div>

              <div className="dashboard-side-content">
                {isErrorSales ? (
                  <div className="analytics-status-box error sales-error-box">
                    <span>
                      {salesError?.message || "Unable to load sales data"}
                    </span>
                  </div>
                ) : (
                  <div className="sales-supporting-metrics">
                    <div className="analytics-card total">
                      <div className="analytics-card-header">
                        <p className="analytics-title">
                          This Month&apos;s Sales
                        </p>
                        <div className="analytics-icon-wrapper">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                      </div>
                      <div className="analytics-body">
                        <h3 className="analytics-value">
                          {formatCurrency(salesAnalytics.thisMonth.totalAmount)}
                        </h3>
                        <span className="analytics-subtitle">
                          {salesAnalytics.thisMonth.count} deals this month
                        </span>
                      </div>
                    </div>

                    <div className="analytics-card progress">
                      <div className="analytics-card-header">
                        <p className="analytics-title">
                          Last Month&apos;s Sales
                        </p>
                        <div className="analytics-icon-wrapper">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 8 8 12 12 16" />
                            <line x1="16" y1="12" x2="8" y2="12" />
                          </svg>
                        </div>
                      </div>
                      <div className="analytics-body">
                        <h3 className="analytics-value">
                          {formatCurrency(salesAnalytics.lastMonth.totalAmount)}
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
                            aria-hidden="true"
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
                            {Number(
                              salesAnalytics.difference.percentage || 0,
                            ).toFixed(2)}
                            %
                          </h3>
                          <span
                            className={`growth-badge ${isPositiveGrowth ? "positive" : "negative"}`}
                          >
                            {growthAmount >= 0 ? "+" : ""}
                            {Math.round(growthAmount).toLocaleString("en-US")}
                          </span>
                        </div>
                        <span className="analytics-subtitle">
                          vs. previous month
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <section className="lead-status-section">
                  <h2 className="section-title">Lead Status</h2>
                  <div className="lead-cards-grid">
                    <div className="analytics-card total">
                      <div className="analytics-card-header">
                        <p className="analytics-title">Total Leads</p>
                        <div className="analytics-icon-wrapper">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                      </div>
                      <div className="analytics-body">
                        <h3 className="analytics-value">
                          {analytics.totalLeads}
                        </h3>
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
                            aria-hidden="true"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" />
                            <line x1="16" y1="11" x2="22" y2="11" />
                          </svg>
                        </div>
                      </div>
                      <div className="analytics-body">
                        <h3 className="analytics-value">
                          {analytics.newLeads}
                        </h3>
                        <span className="analytics-subtitle">
                          Awaiting action
                        </span>
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
                            aria-hidden="true"
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
                        <span className="analytics-subtitle">
                          Active follow-ups
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>

          <section className="trend-section">
            <div className="trend-section-toolbar">
              <h2 className="section-title">
                Performance &amp; Trends Analysis
              </h2>
              <div
                className="trend-period-controls"
                aria-label="Chart date range"
              >
                {[
                  ["month", "Month"],
                  ["threeMonths", "3 months"],
                  ["sixMonths", "6 months"],
                  ["custom", "Date range"],
                ].map(([period, label]) => (
                  <button
                    key={period}
                    type="button"
                    className={`trend-period-button ${
                      selectedPeriod === period ? "active" : ""
                    }`}
                    onClick={() => setSelectedPeriod(period)}
                    aria-pressed={selectedPeriod === period}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {selectedPeriod === "custom" && (
              <div className="custom-date-range">
                <label>
                  From
                  <input
                    type="date"
                    min={trendRangeStart}
                    max={customEndDate}
                    value={customStartDate}
                    onChange={(event) => setCustomStartDate(event.target.value)}
                  />
                </label>
                <label>
                  To
                  <input
                    type="date"
                    min={customStartDate}
                    max={latestTrendDate}
                    value={customEndDate}
                    onChange={(event) => setCustomEndDate(event.target.value)}
                  />
                </label>
              </div>
            )}

            <div className="trend-chart-card">
              <h3 className="chart-title">Sales &amp; Lead Volume Over Time</h3>
              {!hasLeadHistory && salesTrend.length > 0 && (
                <p className="chart-data-notice">
                  Lead history is not available from the active API yet.
                </p>
              )}
              {hasChartActivity ? (
                <div className="trend-chart-wrapper">
                  <Line
                    data={trendChartData}
                    options={trendChartOptions}
                    aria-label="Sales and lead volume over time"
                    role="img"
                  />
                </div>
              ) : (
                <div className="chart-empty-state">
                  No sales or lead activity in this date range.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
