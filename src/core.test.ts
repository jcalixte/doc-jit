import { describe, expect, it } from "vitest"
import {
  getDocumentationsFromFilePath,
  getFolderPathFromFilePath,
  getUrlsFromFilePath,
  hasConfigFile,
} from "./core"

describe("with .doc-jit folder", () => {
  it("retrieves the folder path from a file path", () => {
    const relativeFilePath = "src/modules/user/components/User.tsx"
    const relativeFolderPath = getFolderPathFromFilePath(relativeFilePath)

    expect(relativeFolderPath).toEqual("src/modules/user/components")
  })

  it("retrieves the associated documentation to a file", async () => {
    const relativeFilePath = "src/modules/user/components/User.tsx"

    const componentDocumentations = await getDocumentationsFromFilePath(
      "",
      relativeFilePath
    )

    expect(componentDocumentations).toEqual([
      ".doc-jit/modules/user/components/component.md",
    ])
  })

  it("retrieves an empty array if there is no documentation for the asked file", async () => {
    const relativeFilePath = "src/modules/user/no-documentation/useUser.ts"

    const documentations = await getDocumentationsFromFilePath(
      "",
      relativeFilePath
    )

    expect(documentations).toEqual([])
  })

  it("retrieves the associated documentation to a file with wildcards", async () => {
    const relativeFilePath = "src/modules/book/api/fetchData.ts"

    const documentations = await getDocumentationsFromFilePath(
      "",
      relativeFilePath
    )

    expect(documentations).toEqual([".doc-jit/modules/__/api/fetching-data.md"])
  })

  it("retrieves the associated documentation to a file with wildcards and specific path", async () => {
    const relativeFilePath = "src/modules/book/hook/useBooks.ts"

    const documentations = await getDocumentationsFromFilePath(
      "",
      relativeFilePath
    )

    expect(documentations).toEqual([
      ".doc-jit/modules/__/hook/use-hook.md",
      ".doc-jit/modules/book/hook/use-book-hook.md",
    ])
  })

  it("works with workspace folder", async () => {
    const workspaceFolderPath = process.cwd()
    const absoluteFilePath = `${workspaceFolderPath}/src/modules/book/hook/useBooks.ts`

    const documentations = await getDocumentationsFromFilePath(
      workspaceFolderPath,
      absoluteFilePath
    )

    expect(documentations).toEqual([
      `${workspaceFolderPath}/.doc-jit/modules/__/hook/use-hook.md`,
      `${workspaceFolderPath}/.doc-jit/modules/book/hook/use-book-hook.md`,
    ])
  })
})

describe("with config file", () => {
  it("tells true if there is a config file setup", async () => {
    const configFileConfigured = await hasConfigFile()

    expect(configFileConfigured).toEqual(true)
  })

  it("returns empty array if the file doest not satisfy glob patterns", async () => {
    const workspaceFolderPath = process.cwd()

    const urlsFromFile = await getUrlsFromFilePath(
      workspaceFolderPath,
      "./no-glob-pattern-found"
    )

    expect(urlsFromFile).toEqual([])
  })

  it("returns a list of URLs to open if the file satisfies glob patterns", async () => {
    const workspaceFolderPath = process.cwd()

    const urlsFromFile = await getUrlsFromFilePath(
      workspaceFolderPath,
      "modules/user/UserLogin.component.tsx"
    )

    expect(urlsFromFile).toEqual(["https://link-to-component-doc.com"])
  })

  it("returns a list with glob with string and arrays", async () => {
    const workspaceFolderPath = process.cwd()

    const urlsFromFile = await getUrlsFromFilePath(
      workspaceFolderPath,
      "modules/user/useUser.hook.ts"
    )

    expect(urlsFromFile).toEqual([
      "https://link-to-hook-doc.com",
      "https://link-to-user-ts-files.com",
      "https://link-to-ts-files.com",
    ])
  })
})
