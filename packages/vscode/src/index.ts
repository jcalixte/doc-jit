import { getDocumentationsFromFilePath } from "@doc-jit/core"
import { ExtensionContext, commands, workspace, window, tests } from "vscode"

export function activate(context: ExtensionContext) {
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
  const test = async () => {
    const coms = await commands.getCommands()
    const filteredComs = coms.filter((com) => com.includes("doc"))
    window.showInformationMessage(
      `Good initialisation, ${JSON.stringify(filteredComs)}`
    )
    try {
      await commands.executeCommand("docjit.open")
    } catch (error) {
      window.showInformationMessage(`can not execute command docjit.open`)
    }
  }

  test()
}

export function deactivate() {}
