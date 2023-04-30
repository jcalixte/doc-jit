import path from "path"
import { Uri, commands, window } from "vscode"
import { getUrlsFromFilePath } from "../doc/core"

export const openLinks = async (
  workspaceFolderPath: string,
  filePath: string
) => {
  const links = await getUrlsFromFilePath(workspaceFolderPath, filePath)

  if (!links.length) {
    window.showInformationMessage(`No documentation found for ${filePath}`)
    return
  }

  const labels = links.map((link) => link.label)

  const choosenLabel = await window.showQuickPick(labels, {
    placeHolder: "Open a documentation link",
  })

  if (!choosenLabel) {
    return
  }

  const link = links.find((link) => link.label === choosenLabel)

  if (!link) {
    return
  }

  const uri = link.uri.startsWith("http")
    ? link.uri
    : path.resolve(workspaceFolderPath, link.uri)

  commands.executeCommand("vscode.open", Uri.parse(uri))
}
