# Backlog

Work lives in **[GitHub Issues](https://github.com/snakeage/wedding-anniversary/issues)**, not in a second list here. That *is* the backlog.

## How we work

1. **Agree first.** Before creating an issue or taking a new task into work, the agent proposes it (title, why, priority). The user must **explicitly say yes** — then create the issue. No silent `gh issue create`.
2. Filter by label **`now`**. There must be **exactly one** open issue with `now`.
3. Do that issue (and only that) until it is closed.
4. Close the issue, then put `now` on the next open issue: **`p0` before `p1` before `p2` before `p3`** (after the user agrees to move `now`).
5. Do not copy this queue into Notion, a Google Doc, or a long markdown table — it will drift.

Priorities: `p0` first live sale, `p1` second client / storefront, `p2` trust, `p3` self-serve scale (one epic, not 18 skin tickets).

## Agent

See `AGENTS.md` and `.cursor/rules/product.mdc`. Before coding: say which issue is `now`. If sales are blocked by something that is not `now`, **propose** moving `now` — do not silently start another catalog skin or open a new issue without consent.
