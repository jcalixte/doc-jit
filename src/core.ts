import { globby } from "@cjs-exporter/globby"
import { cosmiconfig } from "cosmiconfig"
import { minimatch } from "minimatch"
import { dirname } from "path"
import { ConfigFile } from "./types/config-file"
import { FolderPath } from "./types/folder-path"

const DOCJIT_FOLDER = (workspaceFolder?: string) =>
  `${workspaceFolder ? `${workspaceFolder}/` : ""}.doc-jit`
const SRC_FOLDER = "src"

const getConfigFile = async (
  workspaceFolder?: string
): Promise<ConfigFile | null> => {
  const explorer = cosmiconfig("doc-jit")

  try {
    const result = await explorer.search(workspaceFolder ?? process.cwd())

    return (result?.config as ConfigFile) || null
  } catch (error) {
    return null
  }
}

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

export const hasConfigFile = async (workspaceFolder?: string) => {
  const file = await getConfigFile(workspaceFolder)

  return file !== null
}

export const getUrlsFromFilePath = async (
  workspaceFolder: string,
  filePath: string
): Promise<string[]> => {
  const configFile = await getConfigFile(workspaceFolder)

  if (!configFile?.patterns) {
    return []
  }

  const links: string[] = []

  for (const globPattern in configFile.patterns) {
    const isMatching = minimatch(filePath, globPattern)

    if (isMatching) {
      const localLinks = configFile.patterns[globPattern]
      if (Array.isArray(localLinks)) {
        links.push(...localLinks)
      } else {
        links.push(localLinks)
      }
    }
  }

  return links
}
