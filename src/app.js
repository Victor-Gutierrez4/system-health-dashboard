import { analyzeSystemHealth } from "./health.js";

const sampleScans = [
  {
    cpuUsage: 28,
    memoryUsage: 82,
    diskUsage: 64,
    networkConnected: true,
    uptimeHours: 214,
    processCount: 146,
    batteryPercent: 71,
    openPorts: [80, 443, 3389],
    loadTrend: [22, 28, 31, 26, 44, 52, 48, 59, 61, 58, 65, 57]
  },
  {
    cpuUsage: 18,
    memoryUsage: 46,
    diskUsage: 51,
    networkConnected: true,
    uptimeHours: 36,
    processCount: 91,
    batteryPercent: 88,
    openPorts: [443],
    loadTrend: [18, 21, 19, 22, 25, 24, 28, 27, 30, 26, 24, 23]
  },
  {
    cpuUsage: 91,
    memoryUsage: 88,
    diskUsage: 93,
    networkConnected: false,
    uptimeHours: 260,
    processCount: 205,
    batteryPercent: 19,
    openPorts: [23, 80, 443],
    loadTrend: [62, 71, 75, 82, 88, 91, 84, 90, 93, 87, 91, 89]
  }
];

let scanIndex = 0;

function setCard(id, valueId, statusId, value, status) {
  const card = document.getElementById(id);
  card.className = `metric-card ${status}`;
  document.getElementById(valueId).textContent = value;
  document.getElementById(statusId).textContent = status.toUpperCase();
}

function renderChart(values) {
  const chart = document.getElementById("loadChart");
  chart.innerHTML = "";

  values.forEach((value) => {
    const bar = document.createElement("div");
    bar.className = `bar ${value >= 70 ? "warning" : ""}`;
    bar.style.height = `${Math.max(value, 8)}%`;
    chart.appendChild(bar);
  });
}

function renderDashboard(data) {
  const analysis = analyzeSystemHealth(data);
  const overallStatus = document.getElementById("overallStatus");
  const overallClass = analysis.overall === "Healthy" ? "ok" : analysis.overall === "Critical" ? "critical" : "warning";

  overallStatus.textContent = analysis.overall;
  overallStatus.className = `status-badge ${overallClass}`;

  setCard("cpuCard", "cpuValue", "cpuStatus", `${data.cpuUsage}%`, analysis.cpuStatus);
  setCard("memoryCard", "memoryValue", "memoryStatus", `${data.memoryUsage}%`, analysis.memoryStatus);
  setCard("diskCard", "diskValue", "diskStatus", `${data.diskUsage}%`, analysis.diskStatus);
  setCard("networkCard", "networkValue", "networkStatus", data.networkConnected ? "Connected" : "Offline", analysis.networkStatus);

  document.getElementById("uptimeValue").textContent = `${data.uptimeHours} hours`;
  document.getElementById("processValue").textContent = `${data.processCount} active`;
  document.getElementById("batteryValue").textContent = `${data.batteryPercent}%`;
  document.getElementById("portsValue").textContent = analysis.portSummary.label;
  document.getElementById("lastScan").textContent = `Last scan: ${new Date().toLocaleString()}`;

  const list = document.getElementById("recommendations");
  list.innerHTML = "";
  analysis.recommendations.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  renderChart(data.loadTrend);
}

document.getElementById("refreshButton").addEventListener("click", () => {
  scanIndex = (scanIndex + 1) % sampleScans.length;
  renderDashboard(sampleScans[scanIndex]);
});

renderDashboard(sampleScans[scanIndex]);

