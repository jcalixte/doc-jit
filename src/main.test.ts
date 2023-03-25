import { describe, expect, it } from "vitest"
import { getDocumentations, getFolderFromFilePath } from "./main"

describe("main", () => {
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

  it("retrieves an empty array if there is no documentation for the asked file", async () => {
    const relativeFilePath = "src/modules/user/no-documentation/useUser.ts"
    const relativeFolderPath = getFolderFromFilePath(relativeFilePath)

    const documentations = await getDocumentations(relativeFolderPath)

    expect(documentations).toEqual([])
  })
})
