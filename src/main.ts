import { globby } from "globby"
import { dirname } from "path"
import { FolderPath } from "./types/folder-path"

const DOCJIT_FOLDER = `.doc-jit/`
const SRC_FOLDER = "src/"

const replaceSrcFolderByDocJITFolder = (folderPath: FolderPath): FolderPath => {
  return folderPath.replace(SRC_FOLDER, DOCJIT_FOLDER) as FolderPath
}

export const getFolderFromFilePath = (filePath: string): FolderPath => {
  return dirname(filePath) as FolderPath
}

export const isFolderPath = (path?: string): path is FolderPath => {
  return !!path
}

export const getDocumentations = async (
  folderPath: FolderPath
): Promise<FolderPath[]> => {
  folderPath = replaceSrcFolderByDocJITFolder(folderPath)
  const documentationPaths = await globby([DOCJIT_FOLDER])
  const documentationFolderPaths = documentationPaths.map((path) =>
    getFolderFromFilePath(path)
  )

  for (const documentationFolderPath of documentationFolderPaths) {
    if (documentationFolderPath === folderPath) {
      const rightDocumentations = await globby(documentationFolderPath)

      return rightDocumentations as FolderPath[]
    }
  }

  return []
}
