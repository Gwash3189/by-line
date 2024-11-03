# byLine

A Deno module for reading files line by line with line numbers.

## Installation

```ts
import { byLine } from "jsr:@username/by-line";
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

--allow-read: Required to read input files

## License

MIT License
