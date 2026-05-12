import { useState } from "react";

/**
 * FilterBar — compact pill-switcher design
 * Filter types: none | category | amount | date
 * Amount sub-modes: exact | range
 * Date sub-modes: day | range
 */
const CATEGORIES = ["food", "transportation", "entertainment", "utilities", "other"];

const FilterBar = ({ onFilter }) => {
  const [activeType, setActiveType] = useState(null); // null | "category" | "amount" | "date"

  // Category
  const [category, setCategory] = useState("");

  // Amount
  const [amountMode, setAmountMode] = useState("exact"); // "exact" | "range"
  const [exactAmount, setExactAmount] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Date
  const [dateMode, setDateMode] = useState("day"); // "day" | "range"
  const [day, setDay] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const switchType = (type) => {
    if (activeType === type) {
      clearAll(true);
    } else {
      setActiveType(type);
    }
  };

  const clearAll = (collapse = false) => {
    setCategory("");
    setExactAmount("");
    setMinAmount("");
    setMaxAmount("");
    setDay("");
    setStartDate("");
    setEndDate("");
    if (collapse) setActiveType(null);
    onFilter({});
  };

  const handleApply = () => {
    if (activeType === "category" && category) {
      onFilter({ category });
    } else if (activeType === "amount") {
      if (amountMode === "exact" && exactAmount) onFilter({ exactAmount });
      else if (amountMode === "range" && (minAmount || maxAmount)) onFilter({ minAmount, maxAmount });
      else onFilter({});
    } else if (activeType === "date") {
      if (dateMode === "day" && day) onFilter({ day });
      else if (dateMode === "range" && (startDate || endDate)) onFilter({ startDate, endDate });
      else onFilter({});
    } else {
      onFilter({});
    }
  };

  // Derive a summary badge shown inside the active pill
  const badge = (() => {
    if (activeType === "category" && category) return category;
    if (activeType === "amount") {
      if (amountMode === "exact" && exactAmount) return `= ₹${exactAmount}`;
      if (amountMode === "range" && (minAmount || maxAmount))
        return `₹${minAmount || "0"} – ₹${maxAmount || "∞"}`;
    }
    if (activeType === "date") {
      if (dateMode === "day" && day) return day;
      if (dateMode === "range" && (startDate || endDate))
        return `${startDate || "…"} → ${endDate || "…"}`;
    }
    return null;
  })();

  return (
    <div className="fb-wrap">

      {/* ── Row 1: pill switcher ── */}
      <div className="fb-pills">
        <span className="fb-pills-label">Filter by</span>

        {["category", "amount", "date"].map((type) => (
          <button
            key={type}
            className={`fb-pill${activeType === type ? " fb-pill--active" : ""}`}
            onClick={() => switchType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
            {activeType === type && badge && (
              <span className="fb-pill-badge">{badge}</span>
            )}
          </button>
        ))}

        {activeType && (
          <button className="fb-clear" onClick={() => clearAll(true)}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* ── Row 2: context-sensitive inputs ── */}
      {activeType && (
        <div className="fb-inputs">

          {/* CATEGORY */}
          {activeType === "category" && (
            <select
              className="fb-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">— pick a category —</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          )}

          {/* AMOUNT */}
          {activeType === "amount" && (
            <>
              <div className="fb-sub-toggle">
                <button
                  className={`fb-sub-btn${amountMode === "exact" ? " fb-sub-btn--on" : ""}`}
                  onClick={() => setAmountMode("exact")}
                >
                  Exact
                </button>
                <button
                  className={`fb-sub-btn${amountMode === "range" ? " fb-sub-btn--on" : ""}`}
                  onClick={() => setAmountMode("range")}
                >
                  Range
                </button>
              </div>

              {amountMode === "exact" ? (
                <input
                  type="number"
                  className="fb-input"
                  placeholder="e.g. 150"
                  value={exactAmount}
                  onChange={(e) => setExactAmount(e.target.value)}
                />
              ) : (
                <div className="fb-pair">
                  <input
                    type="number"
                    className="fb-input"
                    placeholder="Min"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                  />
                  <span className="fb-sep">–</span>
                  <input
                    type="number"
                    className="fb-input"
                    placeholder="Max"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          {/* DATE */}
          {activeType === "date" && (
            <>
              <div className="fb-sub-toggle">
                <button
                  className={`fb-sub-btn${dateMode === "day" ? " fb-sub-btn--on" : ""}`}
                  onClick={() => setDateMode("day")}
                >
                  Specific Day
                </button>
                <button
                  className={`fb-sub-btn${dateMode === "range" ? " fb-sub-btn--on" : ""}`}
                  onClick={() => setDateMode("range")}
                >
                  Range
                </button>
              </div>

              {dateMode === "day" ? (
                <input
                  type="date"
                  className="fb-input"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                />
              ) : (
                <div className="fb-pair">
                  <input
                    type="date"
                    className="fb-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <span className="fb-sep">→</span>
                  <input
                    type="date"
                    className="fb-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          <button className="btn btn-primary btn-sm fb-apply" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;