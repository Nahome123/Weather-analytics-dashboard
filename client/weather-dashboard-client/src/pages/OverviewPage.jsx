import { motion } from "framer-motion";
import WeatherChart from "../components/WeatherChart";

function OverviewPage({
  weather,
  weatherLabel,
  formatTemp,
  forecastSummary,
  totalSearches,
  chartMode,
  tempUnit,
}) {
  const convertTemp = (tempC) =>
    tempUnit === "C" ? tempC : (tempC * 9) / 5 + 32;

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.28 }}
    >
      {weather && (
        <>
          <section className="hero-cards">
            <div className="hero-stat primary">
              <span>Current Temperature</span>
              <h2>{formatTemp(weather.current.temperature)}</h2>
              <p>{weatherLabel}</p>
            </div>

            <div className="hero-stat">
              <span>Wind Speed</span>
              <h2>{weather.current.windSpeed} km/h</h2>
              <p>Live current wind speed</p>
            </div>

            <div className="hero-stat">
              <span>Location</span>
              <h2>
                {weather.city}, {weather.country}
              </h2>
              <p>
                {weather.latitude.toFixed(2)}, {weather.longitude.toFixed(2)}
              </p>
            </div>

            <div className="hero-stat">
              <span>Total Searches</span>
              <h2>{totalSearches}</h2>
              <p>Across saved search activity</p>
            </div>
          </section>

          <section className="content-grid">
            <div className="panel dark-panel">
              <div className="panel-header">
                <div>
                  <h2>Forecast Trend</h2>
                  <p>Animated multi-day temperature analysis</p>
                </div>
              </div>

              <div className="chart-wrap">
                <WeatherChart
                  weather={weather}
                  chartMode={chartMode}
                  tempUnit={tempUnit}
                  convertTemp={convertTemp}
                />
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2>Forecast Summary</h2>
                  <p>Smart overview of the week ahead</p>
                </div>
              </div>

              <div className="insight-stack">
                <div className="insight-item">
                  <span>Peak High</span>
                  <strong>
                    {forecastSummary ? formatTemp(forecastSummary.peakHigh) : "--"}
                  </strong>
                </div>
                <div className="insight-item">
                  <span>Lowest Low</span>
                  <strong>
                    {forecastSummary ? formatTemp(forecastSummary.lowestLow) : "--"}
                  </strong>
                </div>
                <div className="insight-item">
                  <span>Avg High</span>
                  <strong>
                    {forecastSummary ? formatTemp(forecastSummary.avgHigh) : "--"}
                  </strong>
                </div>
                <div className="insight-item">
                  <span>Avg Low</span>
                  <strong>
                    {forecastSummary ? formatTemp(forecastSummary.avgLow) : "--"}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Daily Forecast Cards</h2>
                <p>Interactive forecast snapshots</p>
              </div>
            </div>

            <div className="forecast-strip">
              {weather.forecast.dates.map((date, index) => (
                <div className="forecast-card lift" key={date}>
                  <span className="forecast-day">
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: "short",
                    })}
                  </span>

                  <strong className="forecast-date">
                    {new Date(date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </strong>

                  <div className="forecast-temps">
                    <div>
                      <small>High</small>
                      <span>{formatTemp(weather.forecast.maxTemperatures[index])}</span>
                    </div>
                    <div>
                      <small>Low</small>
                      <span>{formatTemp(weather.forecast.minTemperatures[index])}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </motion.div>
  );
}

export default OverviewPage;