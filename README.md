# IoT Audit Pro – MQTT Protocol Fuzzer

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg?style=for-the-badge&logo=docker)
![Status](https://img.shields.io/badge/status-stable-success.svg?style=for-the-badge)

IoT Audit Pro is a self-hosted security auditing framework designed for Internet of Things environments.  
It performs structured fuzzing attacks on MQTT brokers to evaluate stability, latency, and resilience.  
The system supports both local laboratory simulation through Docker and real-world target auditing.

---

## Key Features

- Dual Operation Mode: Instantly switch between lab simulation and real-world auditing.
- Active Health Monitoring: Continuous heartbeat checks to detect unresponsive or crashed brokers.
- Multiple Attack Vectors: Junk Data Flood, SQL Injection, and JSON Payload Overflow.
- Real-Time Visualization: Live WebSocket streaming logs with alert indicators.
- Modern Interface: Dark-themed dashboard built with React and Tailwind CSS.

---

### Clone the repository
```bash
git clone https://github.com/F9-o/IoT-Audit-Pro.git
```
```bash
cd IoT-Audit-Pro
```

---

## Tech Stack

<div align="center">

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />

  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/MQTT-660066?style=for-the-badge&logo=mqtt&logoColor=white" />

  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />

</div>


---

## Quick Start

Only Docker is required. No need to install Python or Node.js manually.

### 1. Launch the system
```bash
docker-compose up --build
```

### 2. Access the dashboard
Open:
```
http://localhost:5173
```

### 3. Stop and clean up
```bash
docker-compose down
```

---

## Usage Guide

### 1. Select Operation Mode
- Lab Simulation: Uses the internal Mosquitto broker.
- Real World: Target any external MQTT broker.

### 2. Configure Target
- Target IP  
  - Lab mode: automatically set to `mosquitto`  
  - Real mode: enter an IP (example: 192.168.1.50)
- Port: default 1883  
- Attack Type: Junk Data, SQL Injection, or JSON Flood  

### 3. Start the Audit
- Watch the logs for TARGET ACQUIRED.
- Monitor the target status indicator for failures or crashes.

---

## Legal Disclaimer

This project is intended for educational use and authorized internal security auditing.  
Running this tool against systems without permission is illegal.  
The developers assume no responsibility for misuse or resulting damages.
