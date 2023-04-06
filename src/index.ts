import { ExtensionContext, Uri, commands, window, workspace } from "vscode"
import {
  getDocumentationsFromFilePath,
  getUrlsFromFilePath,
  hasConfigFile,
} from "./core"

export const openLinks = async (
  workspaceFolderPath: string,
  filePath: string
) => {
  const links = await getUrlsFromFilePath(workspaceFolderPath, filePath)

  if (!links.length) {
    window.showInformationMessage(`No documentation found for ${filePath}`)
    return
  }

  for (const link of links) {
    commands.executeCommand("vscode.open", Uri.parse(link))
  }
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
}

export const deactivate = () => {}
