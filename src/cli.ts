import { cac } from "cac"
import path from "path"
import fs from "fs"
import { findConfigFile, commentOutLines, makeResources } from "./utils"

import {
  VERSION,
  NEXT_STANDALONE_SERVER_RESOURCES,
  DEFAULT_CONFIG_FILES,
} from "./constants"

const cli = cac("@shin/tools")

// build
cli.command("build", "build for production").action(async () => {
  console.log(`Build start @shin/tools`)
  const configFiles = DEFAULT_CONFIG_FILES.map((item) => path.resolve(item))

  const configFilePath = await findConfigFile(configFiles)
  if (!configFilePath) {
    return new Error("Not found config file")
  }
  console.log(`Found config File: ${configFilePath}`)

  const config = JSON.parse(fs.readFileSync(configFilePath, "utf-8"))
  let nextPackageName = ""

  if (config.monorepo) {
    // commet-out next
    let standaloneServerPath = ""
    const nextDir = config.monorepo.next.dir
    if (config.monorepo.next.useExports) {
      const packageJsonPath = path.resolve(nextDir, "package.json")
      const nextPackageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, "utf-8")
      )

      const standaloneServerRelativePath =
        nextPackageJson.exports["./standalone/server"]
      nextPackageName = nextPackageJson.name
      standaloneServerPath = path.resolve(nextDir, standaloneServerRelativePath)

      if (standaloneServerPath) {
        const regExp = /process\.chdir\(__dirname\);?/g
        commentOutLines(standaloneServerPath, regExp)
      }
    }
    // make next resources for electron
    console.log(`nextPackageName: ${nextPackageName}`)
    if (nextPackageName && config.monorepo.electron.dir) {
      const resourceDir = path.resolve(
        config.monorepo.electron.dir,
        "node_modules",
        nextPackageName
      )
      const sourceDir = path.resolve("node_modules", nextPackageName)

      makeResources(resourceDir, sourceDir, NEXT_STANDALONE_SERVER_RESOURCES)
    }
  }

  console.log(`Build end @shin/tools`)
})

cli.help()
cli.version(VERSION)
cli.parse()
