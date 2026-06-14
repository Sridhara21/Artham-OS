# ARTHAM OS: System Flow & Telemetry Lifecycle

ARTHAM OS processes information through a continuous intelligence loop designed to turn physical logs into actionable policy decisions.

---

## The System Feedback Loop

```
  +─────────────────────────────────────────────────────────────+
  │                           OBSERVE                           │
  │  FASTag Toll Logs ────► Port manifest ────► Rail FOIS Logs  │
  +──────────────────────────────┬──────────────────────────────+
                                 │ Ingests live telemetry
                                 ▼
  +─────────────────────────────────────────────────────────────+
  │                           REASON                            │
  │  Builds Causal Graph (Neo4j) ───► Agent Council verification│
  +──────────────────────────────┬──────────────────────────────+
                                 │ Identifies causal pathways
                                 ▼
  +─────────────────────────────────────────────────────────────+
  │                          FORECAST                           │
  │  Predicts GDP/CPI offsets ────► Stress-tests scenarios      │
  +──────────────────────────────┬──────────────────────────────+
                                 │ Projects ripple effects
                                 ▼
  +─────────────────────────────────────────────────────────────+
  │                          RECOMMEND                          │
  │  Formulates routing blueprints ───► Computes Carbon/Cost    │
  +──────────────────────────────┬──────────────────────────────+
                                 │ Generates overrides
                                 ▼
  +─────────────────────────────────────────────────────────────+
  │                            LEARN                            │
  │  Replays historical crises ───► Calibrates model weights     │
  +──────────────────────────────┬──────────────────────────────+
                                 │ Calibration feedback loop
                                 ▼
  +─────────────────────────────────────────────────────────────+
  │                         GLOBALIZATION                       │
  │  Visualizes global trade flows on rotating 3D Earth         │
  +─────────────────────────────────────────────────────────────+
```

---

## 1. Observe: Multi-Scale Telemetry Ingestion
Information enters the system through high-frequency physical telemetry points:
* FASTag vehicle transit logs.
* Terminal gate dwell times.
* Locomotive wagon allocations.
* Meteorological soil moisture logs.

These metrics are compiled in the **ARTHAM Twin** to establish a baseline of normal capacity velocities.

---

## 2. Reason: Causal Modeling
When an anomaly (e.g., speed drop or price spike) exceeds standard deviations:
* The **PRIME** causal engine constructs a Directed Acyclic Graph (DAG) using Neo4j relationships.
* Specialized AI Agents (e.g., `RiskAgent` and `TradeAgent`) audit connections, verify source metrics (e.g., Drewry Freight Indices), and confirm transmission probabilities.

---

## 3. Forecast: Ripple Projections
The normalized outputs of the causal engine are passed to the **Forecast & Simulator Sandbox**:
* Projection models calculate dynamic estimates for inflation indices and FreightGDP.
* When custom shock values are changed in the **Scenario Lab**, the simulator recalculates the best, expected, and worst-case bounds.

---

## 4. Recommend: Economic Autopilot Override
Using simulation output values, the **Economic Autopilot** generates actionable recommendations:
* Reallocates empty rakes or reroutes freight around congested segments.
* Computes offsets: cost delta, carbon footprint offsets, time saved, and estimated GDP leakage prevented.
* Traces recommendation rationale through the `SIGNAL → EVENT → CONSEQUENCE → OUTCOME` chain.

---

## 5. Learn: Calibration & Time-Machine
The feedback loop is completed in **Replay**:
* Rewinds the system timeline to past major disruptions.
* Evaluates historical predictions against final empirical outcomes.
* Calibrates prediction weights to minimize future calibration errors.
