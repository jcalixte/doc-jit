import { getDocumentationsFromFilePath } from "@doc-jit/core"
import {
  ExtensionContext,
  commands,
  workspace,
  window,
  ViewColumn,
} from "vscode"

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("doc-jit.open", async () => {
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

      const documentations = await getDocumentationsFromFilePath(
        firstWorkspaceFolderPath,
        filePath
      )

      if (!documentations.length) {
        window.showInformationMessage(`No documentation found for ${filePath}`)
        return
      }

      let first = true
      for (const documentation of documentations) {
        const document = await workspace.openTextDocument(documentation)
        window.showTextDocument(document, {
          preview: false,
          viewColumn: first ? ViewColumn.Beside : ViewColumn.Active,
        })
        first = false
      }
    })
  )
}

export function deactivate() {}
