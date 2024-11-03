import { TextLineStream } from "@std/streams";

/**
 * Represents a line of text along with its line number.
 */
export type LineInfo = { line: string; lineNumber: number };

/**
 * Creates an async generator that reads a file line by line, yielding each line along with its line number.
 *
 * @example
 * ```ts
 * for await (const { line, lineNumber } of byLine(Deno.realPath("./input.txt"))) {
 *   console.log(`Line ${lineNumber}: ${line}`);
 * }
 * ```
 *
 * @param filename - The path to the file to read
 *
 * @yields {object} An object containing the line content and line number
 * @yields {string} line - The content of the current line
 * @yields {number} lineNumber - The 1-based line number of the current line
 *
 * @remarks
 * - Uses Deno's built-in file system API and streaming capabilities
 * - Line numbers start at 1
 * - File is read using UTF-8 encoding
 */
export async function* byLine(filename: string): AsyncGenerator<
  {
    line: string;
    lineNumber: number;
  },
  void,
  unknown
> {
  let isClosed = false;
  let file: Deno.FsFile | null = null;

  try {
    file = await Deno.open(filename);
    const lineStream = file.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());
    let lineNumber = 0;
    for await (const line of lineStream) {
      lineNumber++;
      yield { line, lineNumber };
    }
  } finally {
    // Only close if it hasn't been closed already
    if (!isClosed) {
      try {
        file?.close();
        isClosed = true;
      } catch {
        // Ignore error if file is already closed
      }
    }
  }
}
