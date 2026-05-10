import test from "node:test";
import assert from "node:assert/strict";

import {
  analyzeSystemHealth,
  buildRecommendations,
  classifyPercentage,
  getOverallStatus,
  summarizePorts
} from "../src/health.js";

test("classifies percentage thresholds", () => {
  assert.equal(classifyPercentage(40, 70, 90), "ok");
  assert.equal(classifyPercentage(75, 70, 90), "warning");
  assert.equal(classifyPercentage(95, 70, 90), "critical");
});

test("marks Telnet as a critical port finding", () => {
  assert.deepEqual(summarizePorts([23, 80]), {
    status: "critical",
    label: "Telnet open"
  });
});

test("overall status reflects most severe finding", () => {
  assert.equal(getOverallStatus(["ok", "ok"]), "Healthy");
  assert.equal(getOverallStatus(["ok", "warning"]), "Needs Attention");
  assert.equal(getOverallStatus(["ok", "critical"]), "Critical");
});

test("builds practical IT recommendations", () => {
  const recommendations = buildRecommendations({
    cpuUsage: 91,
    memoryUsage: 86,
    diskUsage: 94,
    networkConnected: false,
    uptimeHours: 200,
    processCount: 190,
    openPorts: [23]
  });

  assert.ok(recommendations.some((item) => item.includes("CPU")));
  assert.ok(recommendations.some((item) => item.includes("gateway")));
  assert.ok(recommendations.some((item) => item.includes("Telnet")));
});

test("analyzes a full system scan", () => {
  const report = analyzeSystemHealth({
    cpuUsage: 25,
    memoryUsage: 82,
    diskUsage: 55,
    networkConnected: true,
    uptimeHours: 12,
    processCount: 80,
    openPorts: [443]
  });

  assert.equal(report.cpuStatus, "ok");
  assert.equal(report.memoryStatus, "warning");
  assert.equal(report.overall, "Needs Attention");
  assert.ok(report.recommendations.length > 0);
});

