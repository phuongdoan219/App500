import { spawnSync } from "node:child_process";
import process from "node:process";

const nextBin = process.platform === "win32" ? "next.cmd" : "next";
const result = spawnSync(nextBin, ["build"], {
  cwd: process.cwd(),
  env: { ...process.env, APP500_STATIC_EXPORT: "1" },
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
