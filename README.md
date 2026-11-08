# Piper landing page

Private marketing + download site for Piper (PiperKitOrg).

## Local preview

```bash
cd piper-landing-page
python3 -m http.server 8787
# open http://localhost:8787
```

## Downloads

Six platform binaries in `downloads/` plus matching starter zips in `starter/`:

- macOS: darwin/arm64, darwin/amd64
- Linux: linux/amd64, linux/arm64
- Windows: windows/amd64, windows/arm64

Checksums: `downloads/SHA256SUMS`.

## Refresh binaries from piper-go

```bash
cd ../piper-go
LANDING=../piper-landing-page
for pair in darwin/amd64 darwin/arm64 linux/amd64 linux/arm64 windows/amd64 windows/arm64; do
  os=${pair%/*}; arch=${pair#*/}
  out="piper-${os}-${arch}"
  ext=""; [ "$os" = windows ] && ext=".exe"
  GOOS=$os GOARCH=$arch CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" \
    -o "$LANDING/downloads/${out}${ext}" ./cmd/piper
done
(cd "$LANDING/downloads" && shasum -a 256 piper-* > SHA256SUMS)

# rebuild starter zips (see scripts or re-run the pack loop from git history)
```
