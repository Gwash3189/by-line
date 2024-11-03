# byLine

A Deno module for reading files line by line with line numbers.

## Installation

```ts
import { byLine } from "jsr:@gwash3189/by-line";
```

## Usage

```ts
async function main() {
  for await (const { line, lineNumber } of byLine(filepath)) {
    console.log(`${lineNumber}: ${line}`);
  }
}
```

## Required Permissions

`--allow-read`

## Benchmark Results

```sh
Creating benchmark fixture file...
Benchmark fixture created.
    CPU | Apple M1 Pro
Runtime | Deno 2.0.4 (aarch64-apple-darwin)

benchmark                        time/iter (avg)        iter/s      (min … max)           p75      p99     p995
-------------------------------- ----------------------------- --------------------- --------------------------
byLine - Read all lines                 378.5 ms           2.6 (374.9 ms … 386.0 ms) 380.6 ms 386.0 ms 386.0 ms
TextLineStream - Control                247.6 ms           4.0 (245.5 ms … 250.2 ms) 248.6 ms 250.2 ms 250.2 ms
byLine - Time to first line             581.5 µs         1,720 (283.4 µs …   7.6 ms) 319.2 µs   6.8 ms   7.0 ms
byLine - Read first 1000 lines          692.8 µs         1,443 (558.5 µs …   3.8 ms) 669.6 µs   3.6 ms   3.7 ms
```

## License

MIT License
