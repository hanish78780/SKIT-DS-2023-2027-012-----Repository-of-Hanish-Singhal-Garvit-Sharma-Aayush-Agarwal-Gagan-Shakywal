# Git Workflow

## Branches
- `main`: stable/college-demo
- `develop`: integration
- `feature/<area>`: feature development
- `docs/<area>`: documentation changes

## Flow
```text
feature/* → Pull Request → develop → testing → main
```

Do not develop directly on `main`. Avoid direct feature commits to `develop` when a PR is appropriate.

## Commit style
Prefer small logical commits such as:
- `feat(student): implement student login`
- `feat(driver): add GPS acquisition`
- `fix(backend): validate trip payload`
- `docs: update architecture`
- `test(student): add navigation tests`

Never blindly use `git add .`; review the diff and ensure secrets/build artifacts are excluded.
