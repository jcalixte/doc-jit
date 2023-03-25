import { describe, expect, it } from "vitest"
import { getMainREADME } from "./main"

describe("main", () => {
  it("retrieves the main README.md path from .doc-jit folder", () => {
    const readmePath = getMainREADME()

    expect(readmePath).toBe(".doc-jit/README.md")
  })
})
