# Welcome! 👋
Hey! Thanks for your desire to contribute into Flame. Before submitting a PR please read all information below, it might be very helpful for you, just believe us.

## General
Behave yourself well: don't open duplicate Pull Requests, keep all discussions without harassment, shitpost, racism etc. and just follow [GitHub ToS](https://docs.github.com/en/github/site-policy/github-terms-of-service).

## Active Branches
This repository has only two branches. Each branch has it own version.

* `main` — stable branch. It gets updates only after they were well-tested.
* `dev` — development branch, related to **Flame Canary#9955**. It is unstable and may contain bugs, so if you want to add something new, please choose this branch and do not commit directly into `main`.

## Code style
We are using **eslint** to keep our code pretty and enforce its style. You can run `npm run lint:fix`/`yarn run lint:fix` to fix all eslint problems.

## Commit style
Our commits are based on [conventional commits](https://conventionalcommits.org).

### Examples:
1. <strike>updated clear command</strike> ❌ Commit message is too inaccurate and not conventional.
2. <strike>chore(ClearCommand): i did some changes to clear command</strike> ❌ Commit message does not include any useful information, and it's written in Simple Past.
3. **chore(ClearCommand): make second argument optional** ✅ Everything is perfect!
