import path from "path"
import { ExtensionContext, Uri, commands, window, workspace } from "vscode"
import {
  getDocumentationsFromFilePath,
  getUrlsFromFilePath,
  hasConfigFile,
} from "./core"

const hasDocumentation = async (
  workspaceFolderPath: string,
  filePath: string
) => {
  const links = await getUrlsFromFilePath(workspaceFolderPath, filePath)

  return links.length > 0
}

const displayCommand = async () => {
  const workspaceFolders = workspace.workspaceFolders

  const document = window.activeTextEditor?.document
  const filePath = document?.fileName

  if (workspaceFolders && filePath && window.activeTextEditor) {
    const [firstWorkspaceFolder] = workspaceFolders
    const firstWorkspaceFolderPath = firstWorkspaceFolder.uri.path ?? ""

    commands.executeCommand(
      "setContext",
      "docjit.docExists",
      await hasDocumentation(firstWorkspaceFolderPath, filePath)
    )
  }
}

export const openLinks = async (
  workspaceFolderPath: string,
  filePath: string
) => {
  const links = await getUrlsFromFilePath(workspaceFolderPath, filePath)

  if (!links.length) {
    window.showInformationMessage(`No documentation found for ${filePath}`)
    return
  }

  const link = await window.showQuickPick(links, {
    placeHolder: "Open a documentation link",
  })

  if (!link) {
    return
  }

  const uri = link.startsWith("http")
    ? link
    : path.resolve(workspaceFolderPath, link)

  commands.executeCommand("vscode.open", Uri.parse(uri))
}

export const activate = (context: ExtensionContext) => {
  context.subscriptions.push(
    commands.registerCommand("docjit.open", async () => {
      const document = window.activeTextEditor?.document
      const filePath = document?.fileName

      if (!filePath) {
        return
      }
      let firstWorkspaceFolderPath = ""

      const workspaceFolders = workspace.workspaceFolders
      if (workspaceFolders) {
        const [firstWorkspaceFolder] = workspaceFolders
        firstWorkspaceFolderPath = firstWorkspaceFolder.uri.path
      }

      if (await hasConfigFile(firstWorkspaceFolderPath)) {
        await openLinks(firstWorkspaceFolderPath, filePath)
        return
      }

      const documentations = await getDocumentationsFromFilePath(
        firstWorkspaceFolderPath,
        filePath
      )

      if (!documentations.length) {
        window.showInformationMessage(`No documentation found for ${filePath}`)
        return
      }

      for (const documentation of documentations) {
        const document = await workspace.openTextDocument(documentation)
        window.showTextDocument(document, {
          preview: false,
        })
      }
    })
  )

  displayCommand()
  window.onDidChangeActiveTextEditor(() => {
    displayCommand()
  })
}

export const deactivate = () => {}
