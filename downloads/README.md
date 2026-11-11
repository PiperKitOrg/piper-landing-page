# Downloads

Cross-compiled Piper binaries (CGO disabled). Pick the file that matches your OS and CPU.

| File | Platform |
|------|----------|
| `piper-darwin-arm64` | macOS Apple Silicon |
| `piper-darwin-amd64` | macOS Intel |
| `piper-linux-amd64` | Linux x86_64 |
| `piper-linux-arm64` | Linux ARM64 |
| `piper-windows-amd64.exe` | Windows x86_64 |
| `piper-windows-arm64.exe` | Windows ARM64 |
| `SHA256SUMS` | Checksums for every file above |

## Run without a global install

```bash
chmod +x ./piper-linux-amd64   # macOS/Linux
./piper-linux-amd64 version
./piper-linux-amd64 doctor
```

```powershell
.\piper-windows-amd64.exe version
.\piper-windows-amd64.exe doctor
```

Putting the binary on your PATH is optional. Rename it to `piper` / `piper.exe` if you want a shorter command in that folder.

## Playground

For Compose + sample datasets + a pre-placed binary, clone a platform branch of
[PiperKitOrg/piper-examples](https://github.com/PiperKitOrg/piper-examples)
(for example `-b darwin-arm64`). See that repo’s README.
