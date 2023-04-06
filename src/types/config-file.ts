export interface ConfigFile {
  patterns: {
    [glob: string]: string | string[]
  }
}
