import { motion } from "framer-motion";

function InsightsPage({ stats, totalSearches, topSearchCount, weather, chartMode }) {
  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.28 }}
    >
      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Top Searched Cities</h2>
              <p>Search ranking from stored usage data</p>
            </div>
          </div>

          <div className="ranking-list">
            {stats.length > 0 ? (
              stats.map((item, index) => (
                <div className="ranking-item" key={index}>
                  <div className="ranking-row">
                    <div className="ranking-left">
                      <span className="rank-badge">#{index + 1}</span>
                      <strong>{item.city}</strong>
                    </div>
                    <span>{item.searchCount} searches</span>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(item.searchCount / topSearchCount) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p>No stats yet.</p>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Dashboard Insights</h2>
              <p>Useful KPIs for the current session</p>
            </div>
          </div>

          <div className="insight-stack">
            <div className="insight-item">
              <span>Total Searches</span>
              <strong>{totalSearches}</strong>
            </div>
            <div className="insight-item">
              <span>Ranked Cities</span>
              <strong>{stats.length}</strong>
            </div>
            <div className="insight-item">
              <span>Current Focus</span>
              <strong>{weather ? weather.city : "--"}</strong>
            </div>
            <div className="insight-item">
              <span>Chart Mode</span>
              <strong>{chartMode.toUpperCase()}</strong>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default InsightsPage;