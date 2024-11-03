import { byLine } from "./mod.ts";
import { assert } from "@std/assert";
import { TextLineStream } from "@std/streams";

const TOTAL_LINES = 1_000_000;
const FILE_NAME = "bench_fixture.txt";

// Setup function to create test file
async function createBenchmarkFile() {
  console.log("Creating benchmark fixture file...");
  const encoder = new TextEncoder();
  const file = await Deno.open(FILE_NAME, { write: true, create: true });

  const CHUNK_SIZE = 10000;
  const lineTemplate = "This is test line number ";
  for (let chunk = 0; chunk < TOTAL_LINES / CHUNK_SIZE; chunk++) {
    const lines = [];
    for (let i = 0; i < CHUNK_SIZE; i++) {
      const lineNumber = chunk * CHUNK_SIZE + i + 1;
      lines.push(lineTemplate + lineNumber + "\n");
    }
    await file.write(encoder.encode(lines.join("")));
  }
  console.log("Benchmark fixture created.");
}

// Setup: Create the file before benchmarks
await createBenchmarkFile();

// Main benchmark for byLine function
Deno.bench({
  name: "byLine - Read all lines",
  permissions: {
    read: true,
  },
  async fn() {
    let count = 0;
    for await (const _ of byLine(FILE_NAME)) {
      count++;
    }
    assert(count === TOTAL_LINES, `Expected ${TOTAL_LINES} lines, got ${count}`);
  },
});

// Benchmark baseline using basic TextLineStream
Deno.bench({
  name: "TextLineStream - Control",
  permissions: {
    read: true,
  },
  async fn() {
    const file = await Deno.open(FILE_NAME);
    const lines = file.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());

    let count = 0;
    for await (const _ of lines) {
      count++;
    }

    assert(count === TOTAL_LINES, `Expected ${TOTAL_LINES} lines, got ${count}`);
  },
});

// Time to first line benchmark
Deno.bench({
  name: "byLine - Time to first line",
  permissions: {
    read: true,
  },
  async fn() {
    const generator = byLine(FILE_NAME);
    const { value } = await generator.next();
    assert(value?.lineNumber === 1, "First line should have lineNumber 1");
  },
});

// Read first 1000 lines benchmark
Deno.bench({
  name: "byLine - Read first 1000 lines",
  permissions: {
    read: true,
  },
  async fn() {
    let count = 0;
    for await (const _ of byLine(FILE_NAME)) {
      count++;
      if (count >= 1000) break;
    }
    assert(count === 1000, "Should read exactly 1000 lines");
  },
});

// Cleanup after all benchmarks
Deno.addSignalListener("SIGINT", cleanup);
Deno.addSignalListener("SIGTERM", cleanup);

async function cleanup() {
  try {
    await Deno.remove(FILE_NAME);
    console.log("\nBenchmark fixture file cleaned up.");
  } catch {
    console.error("\nFailed to clean up benchmark fixture file.");
  }
}

// Run with:
// deno bench --allow-read --allow-write benchmark.ts
