import { commands, window, workspace } from "vscode"
import { hasDocumentation } from "../.."

export const displayCommand = async () => {
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
