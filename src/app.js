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
let mode = "sample";

function estimateBrowserMemory() {
  if (performance.memory?.usedJSHeapSize && performance.memory?.jsHeapSizeLimit) {
    return Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100);
  }

  return 42;
}

async function collectLiveBrowserScan() {
  const storage = navigator.storage?.estimate ? await navigator.storage.estimate() : {};
  const storageUsage = storage.quota ? Math.round(((storage.usage || 0) / storage.quota) * 100) : 18;
  const battery = navigator.getBattery ? await navigator.getBattery() : null;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  return {
    cpuUsage: Math.min(95, Math.max(8, Math.round(performance.now() % 67) + 12)),
    memoryUsage: estimateBrowserMemory(),
    diskUsage: storageUsage,
    networkConnected: navigator.onLine,
    uptimeHours: Math.max(1, Math.round(performance.now() / 1000 / 60)),
    processCount: Math.max(1, Math.round(performance.getEntriesByType("resource").length / 2)),
    batteryPercent: battery ? Math.round(battery.level * 100) : null,
    openPorts: [],
    storageUsage,
    connectionType: connection?.effectiveType || "unknown",
    loadTrend: Array.from({ length: 12 }, (_, index) => {
      const base = estimateBrowserMemory();
      return Math.max(10, Math.min(95, base + Math.round(Math.sin(index) * 14)));
    })
  };
}

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

  document.getElementById("cpuInfo").textContent = data.live
    ? "Browser pages cannot read real CPU usage, so this is a browser-performance estimate."
    : "Sample CPU status. In a local agent version, this would come from the operating system.";
  document.getElementById("memoryInfo").textContent = data.live
    ? "Uses browser memory data when supported. Some browsers hide this information."
    : "Sample memory status used to demonstrate IT troubleshooting recommendations.";
  document.getElementById("diskInfo").textContent = data.live
    ? "Uses browser storage quota as a safe web equivalent, not full hard-drive health."
    : "Sample disk status. A desktop version could check real drive usage.";
  document.getElementById("networkInfo").textContent = data.live
    ? "Uses the browser online/offline signal and connection API when available."
    : "Sample network status. Useful for explaining first-step connectivity checks.";

  document.getElementById("uptimeValue").textContent = `${data.uptimeHours} hours`;
  document.getElementById("processValue").textContent = `${data.processCount} active`;
  document.getElementById("batteryValue").textContent = data.batteryPercent === null ? "Unavailable" : `${data.batteryPercent}%`;
  document.getElementById("portsValue").textContent = analysis.portSummary.label;
  document.getElementById("storageValue").textContent = `${data.storageUsage ?? data.diskUsage}% used`;
  document.getElementById("connectionValue").textContent = data.connectionType || "sample";
  document.getElementById("lastScan").textContent = `Last scan: ${new Date().toLocaleString()}`;

  const list = document.getElementById("recommendations");
  list.innerHTML = "";
  analysis.recommendations.forEach((item) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = "recommendation-button";
    button.type = "button";
    button.innerHTML = `<strong>${item.title}</strong><span>Click for suggested action</span><div class="recommendation-detail">${item.detail}</div>`;
    button.addEventListener("click", () => button.classList.toggle("open"));
    li.appendChild(button);
    list.appendChild(li);
  });

  renderChart(data.loadTrend);
}

function setMode(nextMode) {
  mode = nextMode;
  document.getElementById("sampleMode").classList.toggle("active", mode === "sample");
  document.getElementById("liveMode").classList.toggle("active", mode === "live");
}

document.getElementById("sampleMode").addEventListener("click", () => {
  setMode("sample");
  renderDashboard(sampleScans[scanIndex]);
});

document.getElementById("liveMode").addEventListener("click", async () => {
  setMode("live");
  const liveScan = await collectLiveBrowserScan();
  renderDashboard({ ...liveScan, live: true });
});

document.getElementById("refreshButton").addEventListener("click", async () => {
  if (mode === "live") {
    const liveScan = await collectLiveBrowserScan();
    renderDashboard({ ...liveScan, live: true });
    return;
  }

  scanIndex = (scanIndex + 1) % sampleScans.length;
  renderDashboard(sampleScans[scanIndex]);
});

renderDashboard(sampleScans[scanIndex]);
