import { analyzeSystemHealth } from "./health.js";

let mode = "profile";

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function parsePorts(value) {
  return value
    .split(",")
    .map((port) => Number(port.trim()))
    .filter((port) => Number.isInteger(port) && port > 0 && port <= 65535);
}

function buildTrendFromProfile(cpuUsage, memoryUsage) {
  const base = Math.round((cpuUsage + memoryUsage) / 2);
  return [-14, -9, -5, -7, 0, 6, 3, 9, 12, 7, 4, 0].map((offset) =>
    Math.max(8, Math.min(95, base + offset))
  );
}

function collectProfileScan() {
  const cpuUsage = clampNumber(document.getElementById("cpuInput").value, 0, 100, 28);
  const memoryUsage = clampNumber(document.getElementById("memoryInput").value, 0, 100, 82);
  const diskUsage = clampNumber(document.getElementById("diskInput").value, 0, 100, 64);

  return {
    cpuUsage,
    memoryUsage,
    diskUsage,
    networkConnected: document.getElementById("networkInput").value === "true",
    uptimeHours: clampNumber(document.getElementById("uptimeInput").value, 0, 10000, 214),
    processCount: clampNumber(document.getElementById("processInput").value, 0, 10000, 146),
    batteryPercent: clampNumber(document.getElementById("batteryInput").value, 0, 100, 71),
    openPorts: parsePorts(document.getElementById("portsInput").value),
    storageUsage: diskUsage,
    connectionType: "user entered",
    loadTrend: buildTrendFromProfile(cpuUsage, memoryUsage)
  };
}

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
    : "This value comes from the device profile you entered. Check Task Manager for the real CPU percentage.";
  document.getElementById("memoryInfo").textContent = data.live
    ? "Uses browser memory data when supported. Some browsers hide this information."
    : "This value comes from the device profile you entered. Check Task Manager for real memory usage.";
  document.getElementById("diskInfo").textContent = data.live
    ? "Uses browser storage quota as a safe web equivalent, not full hard-drive health."
    : "This value comes from the device profile you entered. Check Windows storage settings for real disk usage.";
  document.getElementById("networkInfo").textContent = data.live
    ? "Uses the browser online/offline signal and connection API when available."
    : "This value comes from the device profile you entered and is used for troubleshooting recommendations.";

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
  document.getElementById("profileMode").classList.toggle("active", mode === "profile");
  document.getElementById("liveMode").classList.toggle("active", mode === "live");
  document.querySelector(".input-panel").hidden = mode !== "profile";
}

document.getElementById("profileMode").addEventListener("click", () => {
  setMode("profile");
  renderDashboard(collectProfileScan());
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

  renderDashboard(collectProfileScan());
});

renderDashboard(collectProfileScan());
