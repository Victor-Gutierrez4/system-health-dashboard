# System Health Checker Dashboard

System Health Checker Dashboard is a small IT portfolio project that presents basic computer health information in a clean web dashboard. It is designed for entry-level IT support, systems support, networking support, and IT operations career paths.

The project demonstrates practical troubleshooting logic, system monitoring concepts, JavaScript, automated testing, and professional documentation.

## What It Shows

The dashboard displays:

- CPU usage
- memory usage
- disk usage
- network connection status
- system uptime
- running process count
- battery status
- common local port checks
- basic security recommendations

The page includes hover/click interactions:

- Hover over metric cards to see what each check means.
- Click **More info** on a metric card to keep the explanation open.
- Click recommendations to expand suggested actions.
- Switch between sample scans and live browser-safe checks.

## Why I Built It

After researching IT support, systems support, networking, cybersecurity, and AI-assisted technical roles, I noticed that many job descriptions mention troubleshooting, monitoring, documentation, automation, and clear communication of technical issues.

My resume already shows programming, web development, databases, Python, JavaScript, and IT coursework. This project helps demonstrate more practical IT operations experience by turning system health checks into a clear dashboard with recommendations.

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js built-in test runner
- GitHub Pages

## Run Locally

Open `index.html` in a browser.

You can also use a local web server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Run Tests

```bash
npm test
```

The tests validate the dashboard's health scoring and recommendation logic.

## Live Check Limitations

Because the project runs on GitHub Pages, it cannot directly access private operating-system data such as real CPU usage, RAM usage, full disk health, running processes, local services, or open ports. Browsers block that information for security.

The **Live Browser Check** mode uses browser-safe signals instead:

- online/offline network status
- browser storage estimate
- browser memory estimate when supported
- battery level when supported
- connection type when supported
- page performance/resource signals

A future advanced version could add a local Python or Node.js companion app to collect full system data with the user's permission.

## GitHub Pages Setup

After pushing this project to GitHub:

1. Open the repository on GitHub.
2. Go to **Settings**.
3. Go to **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/root`.
6. Save.

GitHub will provide a live website link after the page finishes deploying.

## Portfolio Description

System Health Checker Dashboard is a small IT operations project that visualizes common system health checks and gives clear recommendations. I built it to practice troubleshooting, monitoring, automation logic, testing, and technical presentation for IT support and systems support roles.
