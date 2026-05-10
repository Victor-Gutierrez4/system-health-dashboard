import { analyzeSystemHealth } from "./health.js";

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "Unavailable";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function percent(value) {
  return Number.isFinite(value) ? `${value}%` : "Unavailable";
}

function getConnection() {
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
}

function estimateBrowserMemoryPercent() {
  if (performance.memory?.usedJSHeapSize && performance.memory?.jsHeapSizeLimit) {
    return Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100);
  }

  return 0;
}

function getPerformanceLoadScore() {
  const navigation = performance.getEntriesByType("navigation")[0];
  const loadTime = navigation ? Math.round(navigation.loadEventEnd - navigation.startTime) : 0;
  const resources = performance.getEntriesByType("resource").length;
  const scoreFromLoad = Math.min(70, Math.round(loadTime / 40));
  const scoreFromResources = Math.min(25, Math.round(resources / 3));
  return Math.max(5, Math.min(95, scoreFromLoad + scoreFromResources));
}

function getResourceTrend() {
  const durations = performance
    .getEntriesByType("resource")
    .slice(-12)
    .map((entry) => Math.max(8, Math.min(95, Math.round(entry.duration / 8))));

  if (durations.length >= 4) return durations;

  const navigation = performance.getEntriesByType("navigation")[0];
  const fallback = navigation ? Math.max(8, Math.min(95, Math.round(navigation.duration / 40))) : 18;
  return Array.from({ length: 12 }, (_, index) => Math.max(8, Math.min(95, fallback + index - 5)));
}

function getWebGLRenderer() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "Unavailable";
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return "Available, renderer hidden";
    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  } catch {
    return "Unavailable";
  }
}

function isLocalStorageAvailable() {
  try {
    const key = "__health_check_test__";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

async function getPermissionState(name) {
  try {
    if (!navigator.permissions?.query) return "Unavailable";
    const result = await navigator.permissions.query({ name });
    return result.state;
  } catch {
    return "Unavailable";
  }
}

async function collectLiveBrowserScan() {
  const storage = navigator.storage?.estimate ? await navigator.storage.estimate() : {};
  const storageUsage = storage.quota ? Math.round(((storage.usage || 0) / storage.quota) * 100) : 0;
  const storagePersisted = navigator.storage?.persisted ? await navigator.storage.persisted() : null;
  const battery = navigator.getBattery ? await navigator.getBattery() : null;
  const connection = getConnection();
  const navigation = performance.getEntriesByType("navigation")[0];
  const memoryPercent = estimateBrowserMemoryPercent();
  const browserLoad = getPerformanceLoadScore();

  const permissions = {
    geolocation: await getPermissionState("geolocation"),
    notifications: await getPermissionState("notifications"),
    camera: await getPermissionState("camera"),
    microphone: await getPermissionState("microphone")
  };

  return {
    cpuUsage: browserLoad,
    memoryUsage: memoryPercent,
    diskUsage: storageUsage,
    networkConnected: navigator.onLine,
    uptimeHours: Math.max(1, Math.round(performance.now() / 1000 / 60)),
    processCount: performance.getEntriesByType("resource").length,
    batteryPercent: battery ? Math.round(battery.level * 100) : null,
    openPorts: [],
    storageUsage,
    connectionType: connection?.effectiveType || "Unavailable",
    loadTrend: getResourceTrend(),
    live: true,
    details: [
      {
        label: "Online Status",
        value: navigator.onLine ? "Online" : "Offline",
        tip: "Browser-reported connectivity. It confirms network availability, but not whether every service is reachable."
      },
      {
        label: "Connection Type",
        value: connection?.effectiveType || "Unavailable",
        tip: "Network Information API value when supported, such as 4g, 3g, or unknown."
      },
      {
        label: "Downlink Estimate",
        value: connection?.downlink ? `${connection.downlink} Mbps` : "Unavailable",
        tip: "Estimated bandwidth from the browser. It is useful for rough troubleshooting, not exact speed testing."
      },
      {
        label: "Round Trip Time",
        value: connection?.rtt ? `${connection.rtt} ms` : "Unavailable",
        tip: "Estimated network latency reported by the browser when supported."
      },
      {
        label: "Data Saver",
        value: connection?.saveData ? "Enabled" : "Off or unavailable",
        tip: "Shows whether the browser reports a reduced-data preference."
      },
      {
        label: "Browser Memory",
        value: memoryPercent ? `${memoryPercent}%` : "Unavailable",
        tip: "Uses Chrome-style JavaScript heap memory data when available. It is not full system RAM."
      },
      {
        label: "JS Heap Used",
        value: performance.memory?.usedJSHeapSize ? formatBytes(performance.memory.usedJSHeapSize) : "Unavailable",
        tip: "Amount of JavaScript heap currently used by this page when the browser exposes it."
      },
      {
        label: "JS Heap Limit",
        value: performance.memory?.jsHeapSizeLimit ? formatBytes(performance.memory.jsHeapSizeLimit) : "Unavailable",
        tip: "Maximum JavaScript heap available to the browser context when exposed."
      },
      {
        label: "Storage Used",
        value: storage.usage !== undefined ? formatBytes(storage.usage) : "Unavailable",
        tip: "Storage used by this browser origin, not the full computer drive."
      },
      {
        label: "Storage Quota",
        value: storage.quota !== undefined ? formatBytes(storage.quota) : "Unavailable",
        tip: "Estimated storage quota the browser may allow this site to use."
      },
      {
        label: "Persistent Storage",
        value: storagePersisted === null ? "Unavailable" : storagePersisted ? "Granted" : "Not granted",
        tip: "Shows whether this site's storage is protected from automatic browser cleanup."
      },
      {
        label: "Battery Level",
        value: battery ? `${Math.round(battery.level * 100)}%` : "Unavailable",
        tip: "Battery Status API value when supported. Many browsers hide it for privacy."
      },
      {
        label: "Battery Charging",
        value: battery ? (battery.charging ? "Charging" : "Not charging") : "Unavailable",
        tip: "Charging state when the browser supports battery checks."
      },
      {
        label: "CPU Cores",
        value: navigator.hardwareConcurrency || "Unavailable",
        tip: "Logical processor count reported by the browser. This is not live CPU usage."
      },
      {
        label: "Device Memory",
        value: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Unavailable",
        tip: "Approximate device memory reported by some browsers."
      },
      {
        label: "Local Ports",
        value: "Blocked by browser",
        tip: "Web pages cannot scan local open ports. A local script would be required for real port checks."
      },
      {
        label: "Service Worker",
        value: "serviceWorker" in navigator ? "Supported" : "Not supported",
        tip: "Service workers support offline caching and background web app behavior."
      },
      {
        label: "Local Storage",
        value: isLocalStorageAvailable() ? "Available" : "Blocked",
        tip: "Checks whether the browser allows this site to use localStorage."
      },
      {
        label: "Cookies",
        value: navigator.cookieEnabled ? "Enabled" : "Disabled",
        tip: "Cookie availability can affect login sessions and web app behavior."
      },
      {
        label: "Do Not Track",
        value: navigator.doNotTrack || "Unset",
        tip: "Browser privacy preference when provided."
      },
      {
        label: "Secure Context",
        value: window.isSecureContext ? "Yes" : "No",
        tip: "Secure contexts are required for many modern browser APIs."
      },
      {
        label: "Platform",
        value: navigator.platform || "Unavailable",
        tip: "Operating platform string reported by the browser."
      },
      {
        label: "Browser Language",
        value: navigator.language || "Unavailable",
        tip: "Primary language preference reported by the browser."
      },
      {
        label: "Time Zone",
        value: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unavailable",
        tip: "Local time zone reported by the browser."
      },
      {
        label: "Screen Size",
        value: `${screen.width} x ${screen.height}`,
        tip: "Physical screen pixel dimensions reported by the browser."
      },
      {
        label: "Viewport Size",
        value: `${window.innerWidth} x ${window.innerHeight}`,
        tip: "Current browser window size available to this page."
      },
      {
        label: "Pixel Ratio",
        value: window.devicePixelRatio,
        tip: "Ratio between CSS pixels and physical display pixels."
      },
      {
        label: "Color Depth",
        value: `${screen.colorDepth}-bit`,
        tip: "Display color depth reported by the browser."
      },
      {
        label: "Page Load Time",
        value: navigation ? `${Math.round(navigation.loadEventEnd - navigation.startTime)} ms` : "Unavailable",
        tip: "Navigation timing for loading this page."
      },
      {
        label: "Resource Count",
        value: performance.getEntriesByType("resource").length,
        tip: "Number of loaded page resources such as scripts, stylesheets, and assets."
      },
      {
        label: "Page Visibility",
        value: document.visibilityState,
        tip: "Shows whether this page is currently visible or hidden."
      },
      {
        label: "WebGL Renderer",
        value: getWebGLRenderer(),
        tip: "Graphics renderer when the browser allows WebGL renderer information."
      },
      {
        label: "Geolocation Permission",
        value: permissions.geolocation,
        tip: "Permission state only. This dashboard does not request your location."
      },
      {
        label: "Notification Permission",
        value: permissions.notifications,
        tip: "Browser notification permission state."
      },
      {
        label: "Camera Permission",
        value: permissions.camera,
        tip: "Permission state only. This dashboard does not request camera access."
      },
      {
        label: "Microphone Permission",
        value: permissions.microphone,
        tip: "Permission state only. This dashboard does not request microphone access."
      }
    ]
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

function renderDetails(details) {
  const detailsList = document.getElementById("detailsList");
  detailsList.innerHTML = "";

  details.forEach((detail) => {
    const card = document.createElement("div");
    card.className = "detail-card";
    card.tabIndex = 0;
    card.innerHTML = `<span>${detail.label}</span><strong>${detail.value}</strong><p>${detail.tip}</p>`;
    card.addEventListener("click", () => card.classList.toggle("tip-open"));
    detailsList.appendChild(card);
  });
}

function renderDashboard(data) {
  const analysis = analyzeSystemHealth(data);
  const overallStatus = document.getElementById("overallStatus");
  const overallClass = analysis.overall === "Healthy" ? "ok" : analysis.overall === "Critical" ? "critical" : "warning";

  overallStatus.textContent = analysis.overall;
  overallStatus.className = `status-badge ${overallClass}`;

  setCard("cpuCard", "cpuValue", "cpuStatus", `${data.cpuUsage}%`, analysis.cpuStatus);
  setCard("memoryCard", "memoryValue", "memoryStatus", data.memoryUsage ? `${data.memoryUsage}%` : "Hidden", data.memoryUsage ? analysis.memoryStatus : "ok");
  setCard("diskCard", "diskValue", "diskStatus", `${data.diskUsage}%`, analysis.diskStatus);
  setCard("networkCard", "networkValue", "networkStatus", data.networkConnected ? "Online" : "Offline", analysis.networkStatus);

  document.getElementById("cpuInfo").textContent =
    "Browser load is estimated from page load timing and loaded resource count. A web page cannot read full operating-system CPU usage.";
  document.getElementById("memoryInfo").textContent =
    "Browser memory uses JavaScript heap data when supported. Many browsers hide it, and it is not total system RAM.";
  document.getElementById("diskInfo").textContent =
    "Browser storage uses the Storage Estimate API. It is this site's browser quota, not full disk health.";
  document.getElementById("networkInfo").textContent =
    "Network status comes from browser online/offline and Network Information APIs when supported.";
  document.getElementById("lastScan").textContent = `Last scan: ${new Date().toLocaleString()}`;

  renderDetails(data.details);

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

document.querySelectorAll(".metric-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("tip-open"));
});

document.getElementById("refreshButton").addEventListener("click", async () => {
  const liveScan = await collectLiveBrowserScan();
  renderDashboard(liveScan);
});

collectLiveBrowserScan().then(renderDashboard);
