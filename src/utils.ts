import fs from "fs"
import path from "path"

export async function findConfigFile(files: string[]) {
  for (const filePath of files) {
    try {
      await fs.promises.access(filePath)
      return filePath // Return first found file
    } catch (err) {
      // File does not exist, continue to next
    }
  }
  return null
}

export const commentOutLines = (filePath: string, regExp: RegExp) => {
  const fileContent = fs.readFileSync(filePath, "utf-8")

  const modifiedContent = fileContent.replace(regExp, (match) => {
    return `// ${match}`
  })

  fs.writeFileSync(filePath, modifiedContent, "utf-8")

  console.log(`Comment out: ${filePath}`)
}

const copyFile = (src: string, dest: string) => {
  const destDir = path.dirname(dest)
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }
  fs.copyFileSync(src, dest)
}

const copyDirectory = (src: string, dest: string) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const files = fs.readdirSync(src)
  files.forEach((file: string) => {
    const srcPath = path.resolve(src, file)
    const destPath = path.resolve(dest, file)

    const stat = fs.statSync(srcPath)
    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath)
    } else {
      copyFile(srcPath, destPath)
    }
  })
}

export const makeResources = (
  resourceDir: string,
  sourceDir: string,
  sources: string[]
) => {
  if (!fs.existsSync(resourceDir)) {
    fs.mkdirSync(resourceDir, { recursive: true })
  }

  sources.forEach((filePath: string) => {
    console.log(`Copy resource: ${filePath}`)
    const srcPath = path.resolve(sourceDir, filePath)
    const destPath = path.resolve(resourceDir, filePath)

    const stat = fs.statSync(srcPath)
    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath)
    } else {
      copyFile(srcPath, destPath)
    }
  })
}
