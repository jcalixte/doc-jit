import { getDocumentationsFromFilePath } from "@doc-jit/core"

const main = async () => {
  const docs = await getDocumentationsFromFilePath("")

  console.log({ docs })
}

main()
