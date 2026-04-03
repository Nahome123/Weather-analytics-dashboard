import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import api from "./api.js";
import Sidebar from "./components/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import HistoryPage from "./pages/HistoryPage";
import InsightsPage from "./pages/InsightsPage";
import "./App.css";

const QUICK_CITIES = [
  "Buffalo",
  "New York",
  "Chicago",
  "Los Angeles",
  "London",
  "Addis Ababa",
];

const weatherCodeMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Moderate showers",
  82: "Violent showers",
  95: "Thunderstorm",
};

function App() {
  const location = useLocation();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [city, setCity] = useState("Buffalo");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempUnit, setTempUnit] = useState("C");
  const [chartMode, setChartMode] = useState("both");

const convertTemp = (tempC) => {
  if (tempC === null || tempC === undefined || Number.isNaN(Number(tempC))) {
    return null;
  }

  const value = Number(tempC);
  return tempUnit === "C" ? value : (value * 9) / 5 + 32;
};
const formatTemp = (tempC) => {
  const converted = convertTemp(tempC);
  return converted === null ? "--" : `${converted.toFixed(1)}°${tempUnit}`;
};

  const weatherLabel = weather
    ? weatherCodeMap[weather.current.weatherCode] || "Unknown condition"
    : "—";

 const forecastSummary = useMemo(() => {
  const highs = weather?.forecast?.maxTemperatures ?? [];
  const lows = weather?.forecast?.minTemperatures ?? [];

  const validHighs = highs.filter((x) => x !== null && x !== undefined && !Number.isNaN(Number(x)));
  const validLows = lows.filter((x) => x !== null && x !== undefined && !Number.isNaN(Number(x)));

  if (!validHighs.length || !validLows.length) return null;

  return {
    avgHigh: validHighs.reduce((a, b) => a + Number(b), 0) / validHighs.length,
    avgLow: validLows.reduce((a, b) => a + Number(b), 0) / validLows.length,
    peakHigh: Math.max(...validHighs),
    lowestLow: Math.min(...validLows),
  };
}, [weather]);
  const totalSearches = stats.reduce((sum, item) => sum + item.searchCount, 0);
  const topSearchCount = stats.length ? stats[0].searchCount : 1;

  const fetchHistory = async (cityName = "") => {
    const url = cityName
      ? `/weather/history?city=${encodeURIComponent(cityName)}`
      : "/weather/history";

    const response = await api.get(url);
    setHistory(response.data);
  };

  const fetchStats = async () => {
    const response = await api.get("/weather/stats");
    setStats(response.data);
  };

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        `/weather/search?city=${encodeURIComponent(cityName)}`
      );
      setWeather(response.data);
      setCity(response.data.city);
      await fetchHistory(response.data.city);
      await fetchStats();
    } catch (err) {
      console.error(err);
      setError("Could not load weather data. Check the city name or backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    await fetchWeather(city.trim());
  };

  useEffect(() => {
    fetchWeather("Buffalo");
  }, []);

  const sharedProps = {
    weather,
    history,
    stats,
    loading,
    error,
    city,
    setCity,
    weatherLabel,
    tempUnit,
    setTempUnit,
    chartMode,
    setChartMode,
    formatTemp,
    forecastSummary,
    totalSearches,
    topSearchCount,
    fetchWeather,
    handleSearch,
  };

  return (
    <div className="dashboard-shell">
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>

      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div
        className={
          sidebarCollapsed ? "dashboard-content collapsed" : "dashboard-content"
        }
      >
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-btn"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              type="button"
            >
              ☰
            </button>

            <div>
              <span className="kicker">Weather Intelligence</span>
              <h1>Analytics Dashboard</h1>
            </div>
          </div>

          <div className="topbar-right">
            <form className="search-form compact" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Search"}
              </button>
            </form>
          </div>
        </header>

        <div className="quick-row">
          <div className="quick-cities">
            {QUICK_CITIES.map((quickCity) => (
              <button
                key={quickCity}
                className="chip"
                onClick={() => fetchWeather(quickCity)}
                type="button"
              >
                {quickCity}
              </button>
            ))}
          </div>

          <div className="toolbar-actions">
            <div className="toggle-group">
              <button
                className={tempUnit === "C" ? "mini-toggle active" : "mini-toggle"}
                onClick={() => setTempUnit("C")}
                type="button"
              >
                °C
              </button>
              <button
                className={tempUnit === "F" ? "mini-toggle active" : "mini-toggle"}
                onClick={() => setTempUnit("F")}
                type="button"
              >
                °F
              </button>
            </div>

            <div className="toggle-group">
              <button
                className={chartMode === "both" ? "mini-toggle active" : "mini-toggle"}
                onClick={() => setChartMode("both")}
                type="button"
              >
                Both
              </button>
              <button
                className={chartMode === "max" ? "mini-toggle active" : "mini-toggle"}
                onClick={() => setChartMode("max")}
                type="button"
              >
                Max
              </button>
              <button
                className={chartMode === "min" ? "mini-toggle active" : "mini-toggle"}
                onClick={() => setChartMode("min")}
                type="button"
              >
                Min
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<OverviewPage {...sharedProps} />} />
            <Route path="/history" element={<HistoryPage {...sharedProps} />} />
            <Route path="/insights" element={<InsightsPage {...sharedProps} />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;