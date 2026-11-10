# NEXUS OS

Phase 1 scaffold. Install Node 24 LTS, npm, Rust stable, and Xcode Command Line Tools on Apple Silicon macOS.

Run `npm ci`, then `npm run dev`. Run `npm run check`, `npm run build`, and `cargo check --locked` for validation.

Home displays real host CPU and memory readings through a restricted Electron preload API. Memory is total minus free as reported by the host OS. The Rust SQLite foundation is currently a standalone executable. Initialize an app-owned database with `cargo run -p nexus-agent -- work/nexus.sqlite` after creating `work/`.

For native Windows x64 verification, use Windows 10/11 x64 with Node 24 LTS, Rust stable, the `x86_64-pc-windows-msvc` Rust target, Visual Studio 2022 Build Tools with Desktop C++ and Windows SDK, and Git. Run `npm ci`, then `npm run dist:win`. This builds `target/x86_64-pc-windows-msvc/release/nexus-agent.exe` and packages it as `resources/agent/nexus-agent.exe` inside the per-user NSIS installer. The installer does not request elevation by default. Distribution signing requires separate Authenticode configuration.

On the Apple Silicon development Mac, inspect the target with `rustup target list --installed`. The Windows MSVC target is built and verified on Windows because Rust cross-compilation from a non-Windows host is not supported for this target.
