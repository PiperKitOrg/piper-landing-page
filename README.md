# Piper landing page

Private marketing + download site for Piper (PiperKitOrg).

## Local preview

```bash
cd piper-landing-page
python3 -m http.server 8787
# open http://localhost:8787
```

## Downloads

- `downloads/piper-darwin-arm64` — current macOS Apple Silicon binary
- `starter/piper-starter.zip` — unzip-and-run kit (`./piper` at the folder root)

Rebuild the binary from `piper-go`, then refresh copies:

```bash
cd ../piper-go && go build -o piper ./cmd/piper
cp piper ../piper-landing-page/downloads/piper-darwin-arm64
cp piper ../piper-landing-page/starter/piper-starter/piper
cd ../piper-landing-page/starter && rm -f piper-starter.zip && zip -r piper-starter.zip piper-starter -x "*.DS_Store"
shasum -a 256 ../downloads/piper-darwin-arm64 > ../downloads/piper-darwin-arm64.sha256
```
