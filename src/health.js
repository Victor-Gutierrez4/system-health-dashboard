export function classifyPercentage(value, warningAt, criticalAt) {
  if (value >= criticalAt) return "critical";
  if (value >= warningAt) return "warning";
  return "ok";
}

export function classifyNetwork(isConnected) {
  return isConnected ? "ok" : "critical";
}

export function summarizePorts(openPorts) {
  if (openPorts.includes(23)) {
    return { status: "critical", label: "Telnet open" };
  }

  if (openPorts.includes(3389)) {
    return { status: "warning", label: "RDP visible" };
  }

  if (openPorts.length > 0) {
    return { status: "ok", label: `${openPorts.length} common open` };
  }

  return { status: "ok", label: "No common ports" };
}

export function getOverallStatus(checks) {
  if (checks.some((check) => check === "critical")) return "Critical";
  if (checks.some((check) => check === "warning")) return "Needs Attention";
  return "Healthy";
}

export function buildRecommendations(data) {
  const recommendations = [];

  if (data.cpuUsage >= 85) {
    recommendations.push({
      title: "Review high CPU usage",
      detail: "Check Task Manager for high CPU processes and restart unnecessary applications."
    });
  }

  if (data.memoryUsage >= 80) {
    recommendations.push({
      title: "Reduce memory pressure",
      detail: "Close unused applications or review startup programs to reduce memory usage."
    });
  }

  if (data.diskUsage >= 85) {
    recommendations.push({
      title: "Free disk space",
      detail: "Remove temporary files, uninstall unused applications, or move large files to storage."
    });
  }

  if (!data.networkConnected) {
    recommendations.push({
      title: "Troubleshoot network connection",
      detail: "Verify Wi-Fi or Ethernet connection, then test gateway and DNS connectivity."
    });
  }

  if (data.uptimeHours >= 168) {
    recommendations.push({
      title: "Restart and update",
      detail: "Restart the system to apply updates and clear long-running background issues."
    });
  }

  if (data.processCount >= 180) {
    recommendations.push({
      title: "Review background load",
      detail: "Review background processes to identify unnecessary services or startup apps."
    });
  }

  if (data.openPorts.includes(23)) {
    recommendations.push({
      title: "Disable Telnet",
      detail: "Disable Telnet and use SSH or a secure management method instead."
    });
  }

  if (data.openPorts.includes(3389)) {
    recommendations.push({
      title: "Review Remote Desktop exposure",
      detail: "Confirm Remote Desktop is required and protected by appropriate firewall rules."
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "No major issues detected",
      detail: "Continue routine updates, backups, and security checks."
    });
  }

  return recommendations;
}

export function analyzeSystemHealth(data) {
  const cpuStatus = classifyPercentage(data.cpuUsage, 70, 90);
  const memoryStatus = classifyPercentage(data.memoryUsage, 75, 90);
  const diskStatus = classifyPercentage(data.diskUsage, 80, 92);
  const networkStatus = classifyNetwork(data.networkConnected);
  const portSummary = summarizePorts(data.openPorts);
  const overall = getOverallStatus([cpuStatus, memoryStatus, diskStatus, networkStatus, portSummary.status]);

  return {
    cpuStatus,
    memoryStatus,
    diskStatus,
    networkStatus,
    portSummary,
    overall,
    recommendations: buildRecommendations(data)
  };
}
