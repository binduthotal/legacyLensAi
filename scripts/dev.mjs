import { spawn } from "node:child_process";

const services = [
  {
    name: "backend",
    command: "node",
    args: ["backend/src/main.ts"],
  },
  {
    name: "frontend",
    command: "node",
    args: ["frontend/src/main.ts"],
  },
];

const children = services.map((service) => {
  const child = spawn(service.command, service.args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
  });

  child.stdout.on("data", (data) => {
    process.stdout.write(prefixLines(service.name, data));
  });

  child.stderr.on("data", (data) => {
    process.stderr.write(prefixLines(service.name, data));
  });

  child.on("exit", (code, signal) => {
    if (isShuttingDown) {
      return;
    }

    const reason = signal ? `signal ${signal}` : `code ${code ?? 0}`;
    console.error(`${service.name} exited with ${reason}. Stopping dev services.`);
    shutdown(code ?? 1);
  });

  return child;
});

let isShuttingDown = false;

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

function shutdown(code) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exit(code);
}

function prefixLines(serviceName, data) {
  return String(data)
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => `[${serviceName}] ${line}\n`)
    .join("");
}
