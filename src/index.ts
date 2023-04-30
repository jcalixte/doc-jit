import { ExtensionContext, commands, window, workspace } from "vscode"
import {
  getDocumentationsFromFilePath,
  getUrlsFromFilePath,
  hasConfigFile,
} from "./modules/doc/core"
import { displayCommand } from "./modules/vscode/displayCommand"
import { openLinks } from "./modules/vscode/openLinks"

export const hasDocumentation = async (
  workspaceFolderPath: string,
  filePath: string
) => {
  const links = await getUrlsFromFilePath(workspaceFolderPath, filePath)

  return links.length > 0
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
