import { readFileSync } from "fs"

export const DEFAULT_CONFIG_FILES = ["st.config.json"]

const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url)).toString()
)

export const VERSION = version

export const NEXT_STANDALONE_SERVER_RESOURCES = [
  "package.json",
  ".next/package.json",
  ".next/standalone",
]
