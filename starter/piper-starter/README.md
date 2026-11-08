# Piper starter

A ready-to-run folder for a single migration. The `piper` binary lives in this
directory, so you can run it from here without installing anything globally.

```bash
./piper doctor
./piper inspect
./piper plan --target mongo
./piper execute
./piper validate
```

## Platform

This zip includes a **macOS Apple Silicon (darwin/arm64)** binary. On Intel Mac,
Linux, or Windows, grab the matching binary from the landing page downloads
folder (or build from `piper-go`) and replace `./piper`.

## Setup

1. Copy `env.example` to a local env file (do not commit secrets):

   ```bash
   cp env.example .env
   ```

2. Fill in your source and target URLs in `.env`, then load them into your shell:

   ```bash
   set -a && source .env && set +a
   ```

   Piper reads `PIPER_SOURCE_URL` and `PIPER_TARGET_URL` from the environment.
   Credentials never belong in the plan artifacts under `.piper/`.

3. Run from **this folder root** (where `./piper` is):

   ```bash
   ./piper doctor
   ./piper inspect
   ./piper plan --target <mysql|postgres|mongo>
   ```

4. Read the plan warnings, then execute and validate when you accept them.

## Optional: global install

You do **not** need a global PATH entry. If you want one later:

```bash
sudo cp ./piper /usr/local/bin/piper
# or: mkdir -p ~/bin && cp ./piper ~/bin/piper && export PATH="$HOME/bin:$PATH"
```

## Folders

| Path | Purpose |
|------|---------|
| `notes/` | Your review notes, screenshots, cutover checklist |
| `scripts/` | Optional helper scripts you add for this migration |
| `.piper/` | Created automatically by `inspect` / `plan` / `execute` — leave it here |

Same-dialect migrations are out of scope. Pick a different dialect for `--target`.
