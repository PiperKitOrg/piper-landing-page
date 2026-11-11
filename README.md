# Piper landing page

Private marketing + download site for Piper (PiperKitOrg).

## Local preview

```bash
cd piper-landing-page
python3 -m http.server 8787
# open http://localhost:8787
```

## Downloads

Six platform binaries in `downloads/`:

- macOS: darwin/arm64, darwin/amd64
- Linux: linux/amd64, linux/arm64
- Windows: windows/amd64, windows/arm64

Checksums: `downloads/SHA256SUMS`.

Playground kits are **not** zip files on this site. Users clone a platform branch of
[PiperKitOrg/piper-examples](https://github.com/PiperKitOrg/piper-examples)
(`darwin-arm64`, `darwin-amd64`, `linux-amd64`, `linux-arm64`, `windows-amd64`, `windows-arm64`).

## Refresh binaries from piper-go

```bash
cd ../piper-go
LANDING=../piper-landing-page
EXAMPLE=../piper-example
for pair in darwin/amd64 darwin/arm64 linux/amd64 linux/arm64 windows/amd64 windows/arm64; do
  os=${pair%/*}; arch=${pair#*/}
  out="piper-${os}-${arch}"
  ext=""; [ "$os" = windows ] && ext=".exe"
  GOOS=$os GOARCH=$arch CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" \
    -o "$LANDING/downloads/${out}${ext}" ./cmd/piper
done
(cd "$LANDING/downloads" && shasum -a 256 piper-* > SHA256SUMS)

# Push the same binaries onto piper-examples platform branches:
# for each os-arch branch, replace bin/piper (and bin/piper.exe on Windows),
# commit, and git push origin <os>-<arch>.
```
