import { globby } from "globby"
import { dirname } from "path"
import { FolderPath } from "./types/folder-path"
import { minimatch } from "minimatch"

const DOCJIT_FOLDER = `.doc-jit/`
const SRC_FOLDER = "src/"

const makeFolderPath = (path: string): FolderPath => {
  if (!isFolderPath(path)) {
    throw new Error(`Can not make path as a folder path: ${path}`)
  }

  return path
}

const replaceSrcFolderByDocJITFolder = (folderPath: FolderPath): FolderPath => {
  return makeFolderPath(folderPath.replace(SRC_FOLDER, DOCJIT_FOLDER))
}

export const getFolderFromFilePath = (filePath: string): FolderPath => {
  return makeFolderPath(dirname(filePath))
}

export const isFolderPath = (path?: string): path is FolderPath => {
  return !!path
}

export const transformFolderPathToGlobPattern = (
  folderPath: FolderPath
): string => {
  return folderPath.replaceAll("_", "*")
}

export const getDocumentationsFromFilePath = async (
  filePath: string
): Promise<FolderPath[]> => {
  const folderPath = replaceSrcFolderByDocJITFolder(
    getFolderFromFilePath(filePath)
  )

  const documentations: FolderPath[] = []

  const documentationPaths = await globby([DOCJIT_FOLDER])

  const documentationFolderPaths = documentationPaths.map((path) =>
    getFolderFromFilePath(path)
  )

  for (const documentationFolderPath of documentationFolderPaths) {
    const doesFolderPathMatch = minimatch(
      folderPath,
      transformFolderPathToGlobPattern(documentationFolderPath)
    )

    if (doesFolderPathMatch) {
      documentations.push(documentationFolderPath)
    }
  }

  return (await globby(documentations)) as FolderPath[]
}
