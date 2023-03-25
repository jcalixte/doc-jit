import { describe, expect, it } from "vitest"
import { getDocumentation, getFolderFromFilePath, getMainREADME } from "./main"

describe("main", () => {
  it("retrieves the main README.md path from .doc-jit folder", () => {
    const readmePath = getMainREADME()

    expect(readmePath).toBe(".doc-jit/README.md")
  })

  it("retrieves the folder path from a file path", () => {
    const relativeFilePath = "src/modules/user/components/User.tsx"
    const relativeFolderPath = getFolderFromFilePath(relativeFilePath)

    expect(relativeFolderPath).toEqual("src/modules/user/components")
  })

  it("tells if the file has an associated documentation", async () => {
    const relativeFilePath = "src/modules/user/components/User.tsx"
    const relativeFolderPath = getFolderFromFilePath(relativeFilePath)

    const componentDocumentation = await getDocumentation(relativeFolderPath)

    expect(componentDocumentation).toEqual(
      ".doc-jit/modules/user/components/component.md"
    )
  })
})
