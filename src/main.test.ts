import { describe, expect, it } from "vitest"
import {
  getDocumentationsFromFilePath,
  getFolderPathFromFilePath,
} from "./main"

describe("main", () => {
  it("retrieves the folder path from a file path", () => {
    const relativeFilePath = "src/modules/user/components/User.tsx"
    const relativeFolderPath = getFolderPathFromFilePath(relativeFilePath)

    expect(relativeFolderPath).toEqual("src/modules/user/components")
  })

  it("retrieves the associated documentation to a file", async () => {
    const relativeFilePath = "src/modules/user/components/User.tsx"

    const componentDocumentations = await getDocumentationsFromFilePath(
      relativeFilePath
    )

    expect(componentDocumentations).toEqual([
      ".doc-jit/modules/user/components/component.md",
    ])
  })

  it("retrieves an empty array if there is no documentation for the asked file", async () => {
    const relativeFilePath = "src/modules/user/no-documentation/useUser.ts"

    const documentations = await getDocumentationsFromFilePath(relativeFilePath)

    expect(documentations).toEqual([])
  })

  it("retrieves the associated documentation to a file with wildcards", async () => {
    const relativeFilePath = "src/modules/book/api/fetchData.ts"

    const documentations = await getDocumentationsFromFilePath(relativeFilePath)

    expect(documentations).toEqual([".doc-jit/modules/__/api/fetching-data.md"])
  })

  it("retrieves the associated documentation to a file with wildcards and specific path", async () => {
    const relativeFilePath = "src/modules/book/hook/useBooks.ts"

    const documentations = await getDocumentationsFromFilePath(relativeFilePath)

    expect(documentations).toEqual([
      ".doc-jit/modules/__/hook/use-hook.md",
      ".doc-jit/modules/book/hook/use-book-hook.md",
    ])
  })
})
