import { ExtensionContext, commands, workspace, window } from "vscode"

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("doc-jit.open", async () => {
      const filePath = window.activeTextEditor?.document.fileName

      if (!filePath) {
        return
      }

      const documentations: string[] = []

      if (!documentations.length) {
        window.showInformationMessage(`No documentation found for ${filePath}`)
        return
      }

      documentations.forEach((documentation) => {
        workspace.openTextDocument(documentation).then((document) => {
          window.showTextDocument(document, undefined, true)
        })
      })
    })
  )
}

export function deactivate() {}
