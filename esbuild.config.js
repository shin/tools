import { context } from "esbuild"
import { glob } from "glob"
import fs from "fs"

async function cleanDist() {
  try {
    await fs.promises.rm("dist", { recursive: true, force: true })
    console.log("Esbuild: Cleaned dist directory.")
  } catch (err) {
    console.error("Esbuild: Failed to clean dist directory.", err)
  }
}

// Plugin to append .js to relative imports
const appendJsExtensionPlugin = {
  name: "append-js-extension",
  setup(build) {
    build.onLoad({ filter: /\.ts$/ }, async (args) => {
      const contents = await fs.promises.readFile(args.path, "utf8")
      // Regex targets relative imports without an extension
      const modified = contents.replace(
        // Updated regex to match both static and dynamic imports
        // (from\s+['"]|import\s*\(\s*['"]): Matches either:
        // Static imports: from '... or from "..."
        // Dynamic imports: import('... or import("...
        /(from\s+['"]|import\s*\(\s*['"])(\.?\.\/[^'"]*)(['"])/g,
        (test, start, path, end) => {
          // Append .js ONLY if the path doesn't already have an extension
          if (!path.match(/\.\w+$/)) {
            return `${start}${path}.js${end}`
          }
          return `${start}${path}${end}`
        }
      )
      return { contents: modified, loader: "ts" }
    })
  },
}

const ctx = await context({
  entryPoints: await glob("src/**/*.ts"),
  outdir: "dist",
  format: "esm",
  bundle: false,
  plugins: [appendJsExtensionPlugin],
})

await cleanDist()

if (process.argv.includes("--watch")) {
  await ctx.watch() // Enable watch mode
  console.log("Esbuild: Watching for file changes...")
} else {
  await ctx.rebuild() // Perform a one-time build
  await ctx.dispose() // Clean up
  console.log("Esbuild: Build completed.")
}
