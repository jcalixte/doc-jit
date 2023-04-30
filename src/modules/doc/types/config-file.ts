import { Resource } from "./resource"

export interface ConfigFile {
  patterns: {
    [glob: string]: string | string[] | Resource | Resource[]
  }
}
