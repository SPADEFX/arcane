// Start all services for Arcane
const { spawn } = require("child_process");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const services = [
  {
    name: "Extract Tool API",
    cmd: "node",
    args: ["server.js"],
    cwd: path.join(ROOT, "Extract Tool"),
  },
  {
    name: "Medal Forge",
    cmd: "npx",
    args: ["next", "dev", "-p", "3001"],
    cwd: path.join(ROOT, "medal-forge"),
  },
  {
    name: "Studio (Vite)",
    cmd: "npx",
    args: ["vite", "--port", "3333"],
    cwd: __dirname,
  },
  {
    name: "Storybook",
    cmd: "npx",
    args: ["storybook", "dev", "-p", "6006", "--no-open"],
    cwd: __dirname,
  },
];

console.log("\n  Arcane — Starting all services...\n");

for (const svc of services) {
  const child = spawn(svc.cmd, svc.args, {
    cwd: svc.cwd,
    stdio: "pipe",
    shell: true,
  });

  child.stdout.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach((line) => {
      if (line.trim()) console.log(`  [${svc.name}] ${line.trim()}`);
    });
  });

  child.stderr.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach((line) => {
      if (line.trim() && !line.includes("EBADENGINE") && !line.includes("npm warn"))
        console.log(`  [${svc.name}] ${line.trim()}`);
    });
  });

  child.on("exit", (code) => {
    console.log(`  [${svc.name}] exited (code ${code})`);
  });
}

console.log(`
  Services:
    Extract Tool API  → http://localhost:3000
    Medal Forge       → http://localhost:3001
    Studio            → http://localhost:3333
    Storybook         → http://localhost:6006  ← LIBRARY
`);
