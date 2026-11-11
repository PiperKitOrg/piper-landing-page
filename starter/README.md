# Starter kits (retired)

Starter zips are no longer shipped from this site.

For a first try, clone the platform branch of the public playground:

https://github.com/PiperKitOrg/piper-examples

Example (macOS Apple Silicon):

```bash
git clone --recurse-submodules -b darwin-arm64 https://github.com/PiperKitOrg/piper-examples.git
```

Each OS/CPU has its own branch (`darwin-arm64`, `darwin-amd64`, `linux-amd64`, `linux-arm64`, `windows-amd64`, `windows-arm64`) with that platform’s Piper binary already in `bin/`. Sample datasets come in as git submodules.
