import { globby } from "@cjs-exporter/globby"
import { dirname } from "path"
import { FolderPath } from "./types/folder-path"
import { minimatch } from "minimatch"

const DOCJIT_FOLDER = (workspaceFolder?: string) =>
  `${workspaceFolder ? `${workspaceFolder}/` : ""}.doc-jit`
const SRC_FOLDER = "src"

const makeFolderPath = (path: string): FolderPath => {
  if (!isFolderPath(path)) {
    throw new Error(`Can not make path as a folder path: ${path}`)
  }

  return path
}

const replaceSrcFolderByDocJITFolder = (folderPath: FolderPath): FolderPath => {
  return makeFolderPath(folderPath.replace(SRC_FOLDER, DOCJIT_FOLDER()))
}

const transformFolderPathToGlobPattern = (folderPath: FolderPath): string => {
  return folderPath.replaceAll("_", "*")
}

const isFolderPath = (path?: string): path is FolderPath => {
  return !!path
}

export const getFolderPathFromFilePath = (filePath: string): FolderPath => {
  return makeFolderPath(dirname(filePath))
}

export const getDocumentationsFromFilePath = async (
  workspaceFolder: string,
  filePath: string
): Promise<FolderPath[]> => {
  const folderPath = replaceSrcFolderByDocJITFolder(
    getFolderPathFromFilePath(filePath)
  )

  const allDocumentationPaths = await globby([DOCJIT_FOLDER(workspaceFolder)])

  const documentationPaths = allDocumentationPaths
    .map((path) => getFolderPathFromFilePath(path))
    .filter((documentationFolderPath) =>
      minimatch(
        folderPath,
        transformFolderPathToGlobPattern(documentationFolderPath)
      )
    )

  const documentations = (await globby(documentationPaths)) as FolderPath[]

  return documentations
}
