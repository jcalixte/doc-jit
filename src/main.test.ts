import { describe, expect, it } from "vitest"
import { getDocumentations, getFolderFromFilePath, getMainREADME } from "./main"

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

  it("retrieves the associated documentation to a file", async () => {
    const relativeFilePath = "src/modules/user/components/User.tsx"
    const relativeFolderPath = getFolderFromFilePath(relativeFilePath)

    const componentDocumentations = await getDocumentations(relativeFolderPath)

    expect(componentDocumentations).toEqual([
      ".doc-jit/modules/user/components/component.md",
    ])
  })
})
