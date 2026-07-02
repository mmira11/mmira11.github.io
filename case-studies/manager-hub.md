# Case Study: A Real-Time Shift Operations Dashboard

> **A note on what you're reading.** This case study describes the architecture and engineering decisions behind a tool I built and use at my job in vehicle manufacturing. Everything below is described in general terms, and every number, name, and screenshot is fabricated using a fictional company ("Atlas Motors") I built specifically to illustrate this write-up — no proprietary data, internal tooling names, or employer-specific details are represented anywhere on this page.

## The problem

I manage a production shift of roughly 300 people. On any given day, answering "are we going to hit target, and why or why not" meant manually checking four to five separate internal systems — one for production counts, one for quality holds, one for attendance, one for safety incidents — and mentally stitching them together. That stitching-together step was slow, error-prone, and happened dozens of times a shift.

I built a single-pane-of-glass dashboard to do that stitching automatically: pull from each underlying data source, normalize it, and surface the few numbers and the one auto-generated sentence that actually matter for "what should I be paying attention to right now."

## What it does

The real tool runs entirely offline on a work laptop — no internet dependency, no cloud service, nothing that can go down if the network does. It's a single-page front end (roughly 4,800 lines of HTML/CSS/JS) backed by a lightweight local server (around 1,400 lines), reading and writing 16 structured data files. It covers nine operational views — a command-center overview, rate-and-pace tracking, quality detail, supervisor roll-up, attendance, safety, team roster, shift passdown notes, and equipment status — refreshing every 60 seconds.

The screenshots and demo referenced in this write-up are from a clean-room rebuild — same architecture, same logic, entirely fabricated company and data — built specifically so this case study could include working visuals without exposing anything real.

## Architecture and key decisions

**Zero runtime dependencies, by design.** The tool doesn't rely on a framework, a build step, or an internet connection. A production floor laptop needs to keep working when the network doesn't. That constraint shaped almost every other decision below.

**A local server instead of a database.** Data lives in flat, structured files rather than a database engine, served by a small local HTTP server. For a single-operator tool refreshing every minute, a database would have been solving a problem that didn't exist — the tradeoff is that this approach doesn't scale to multiple concurrent writers, which is the right call for "one manager's laptop" and the wrong call the moment more than one person needs to write to it at once.

**A data-integrity guard pipeline, not a "trust the input" model.** Source data from upstream systems is inconsistent — sometimes stale, sometimes malformed, sometimes simply missing for a period. Rather than letting bad data silently produce a wrong number on screen, the tool runs incoming data through a multi-stage validation pass: flagging staleness (how old is this file, and is that too old to trust), carrying forward the last known-good value when a refresh fails outright, and logging when and why a value was flagged so the failure mode is visible instead of silent.

**Atomic writes.** Because the dashboard is also writing data back (supervisor notes, manual overrides), writes are structured so a crash or a closed laptop lid mid-write can't corrupt the underlying files into a half-written, unreadable state.

**Break-aware math.** Naive throughput math (units produced ÷ shift hours) is wrong on a real production floor, because people take breaks. The rate and pace calculations explicitly subtract scheduled break time from the denominator — a small detail, but the difference between a number that looks right and a number that's actually right.

**An auto-generated plain-language summary, not just a wall of metrics.** Numbers alone require the reader to do synthesis themselves. The command-center view includes a short, auto-generated sentence that does that synthesis for them — current output vs. target, which area is driving any gap, and what changed recently. This is the single feature that took the tool from "a dashboard" to "something that saves real reading time," and it's the one most worth re-illustrating in the demo build.

**Three-tier OEE reporting.** Overall Equipment Effectiveness can be calculated several legitimate ways depending on what you're trying to see — a simplified output-only view, an output-and-quality view, or the full three-factor (availability × performance × quality) calculation. Rather than picking one and hiding the rest, the tool shows all three side by side with the formula underneath each, so the viewer can see exactly what's being measured and why the numbers differ.

## What I'd change at scale

This tool was built for one operator, on one laptop, for one shift. If it needed to serve multiple managers simultaneously, or run across a whole site instead of one shift, the local-file-and-server model breaks down — concurrent writes need real conflict resolution, which means an actual database and likely a small backend service rather than a laptop-local server. I'd also want to move the data-integrity guard logic server-side rather than client-side, so every consumer of the data gets the same validated view instead of each client re-deriving it independently.

## Tech stack

HTML / CSS / JavaScript (no framework) · a lightweight local HTTP server · structured flat-file data storage · chart-based analytics for trend views

---

*All figures, company names, and screenshots referenced above are fabricated for illustration. See the [Atlas Motors demo](https://mmira11.github.io/atlas-motors-dashboard/) for a working clean-room rebuild of the Command Center, Scoreboard, and OEE views described here. ([Source code](https://github.com/mmira11/atlas-motors-dashboard))*
