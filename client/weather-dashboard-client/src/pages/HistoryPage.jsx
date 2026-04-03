import { motion } from "framer-motion";

function HistoryPage({ history, city, formatTemp }) {
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
              <h2>Recent History</h2>
              <p>Stored weather snapshots from SQL Server</p>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>City</th>
                  <th>Temp</th>
                  <th>Wind</th>
                  <th>Code</th>
                  <th>Recorded</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="table-city">
                          <strong>{item.city}</strong>
                          <span>{item.country}</span>
                        </div>
                      </td>
                      <td>{formatTemp(item.temperatureC)}</td>
                      <td>{item.windSpeed} km/h</td>
                      <td>{item.weatherCode}</td>
                      <td>{new Date(item.recordedAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No history yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>History Snapshot</h2>
              <p>At-a-glance activity summary</p>
            </div>
          </div>

          <div className="insight-stack">
            <div className="insight-item">
              <span>Rows Loaded</span>
              <strong>{history.length}</strong>
            </div>
            <div className="insight-item">
              <span>Selected City</span>
              <strong>{city || "--"}</strong>
            </div>
            <div className="insight-item">
              <span>Latest Record</span>
              <strong>
                {history.length
                  ? new Date(history[0].recordedAt).toLocaleString()
                  : "--"}
              </strong>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default HistoryPage;