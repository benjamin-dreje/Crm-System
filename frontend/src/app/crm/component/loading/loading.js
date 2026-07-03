"use client";

import "./loading.css";

export default function Loading({ text = "Loading..." }) {
  return (
    <div className="loading-wrapper">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
