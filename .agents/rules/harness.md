# Agent harness: scope, chats, review

## 1. Scope before edits
- The user names the screen, the change, and what must stay; the agent proposes the exact file scope.
- **Plan first** for product, IA, architecture, or anything beyond a one-line obvious fix. Do not edit files until the user agrees.
- In every plan, clearly list:
  - **In scope:** files or directories to change.
  - **Out of scope:** screens or files that stay untouched.
- Do not touch neighboring screens or components unasked (e.g. do not rewrite navigation while changing gallery fields).
- After edits, verify that modified files match the approved plan. Revert any accidental extra changes.

## 2. Review on risky PRs
- CI (`npm test`, lint) runs on every PR as the first reviewer.
- **Risky surfaces** in this repo: cabinet APIs, RSVP, login/session, payment/receipt, event schema or slug, guest skins.
- If a PR touches any of these risky surfaces: after opening the PR, **remind** the user to open a **new** chat with the PR link for review (e.g. `/review-bugbot` or subagent review). Do not run the review inside the authoring chat.
- Copy, CSS, documentation: diff + CI is enough. Offer commit / push / PR / «вливай» in the current chat.

## 3. Merge policy
- Merge only when the user explicitly says **«вливай»** or **«мердж»**.
- Merge command: `gh pr merge <n> --squash --delete-branch`, followed by `git checkout main && git pull`.
- Never leave remote feature branches after merging.

## 4. Chats
- One task = one branch = one chat.
- After merging a PR, close the task, offer to move the `now` label in GitHub Issues, and suggest opening a **new chat** for the next task.
