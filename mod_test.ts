import { byLine } from "./mod.ts";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";

describe("byLine", () => {
  describe("when given a file that exists", () => {
    let filepath: string;

    beforeAll(async () => {
      filepath = await Deno.realPath("./fixture.txt");
    });

    it("yields each line along with its line number", async () => {
      const lines = [];
      for await (const { line, lineNumber } of byLine(filepath)) {
        lines.push({ line, lineNumber });
      }

      expect(lines).toEqual([
        { line: "Hello", lineNumber: 1 },
        { line: "World", lineNumber: 2 },
        { line: "", lineNumber: 3 },
        { line: "Thanks!", lineNumber: 4 },
      ]);
    });
  });

  describe("when given a file that does not exists", () => {
    it("throws an error", () => {
      expect(byLine("nonexistent.txt").next()).rejects.toThrow();
    });
  });
});
