//Imports
import { cli } from "./analyzer/cli.mjs"
import { IndepthAnalyzer } from "./analyzer/indepth.mjs"
import { RecentAnalyzer } from "./analyzer/recent.mjs"
import { ApiAnalyzer, GraphQLBatchAnalyzer } from "./analyzer/api.mjs"

/**API-based analyzer (fast, uses GitHub's pre-computed statistics) */
export async function api({login, data, imports, rest, context, repositories}, {skipped, categories, timeout}) {
  return new ApiAnalyzer(login, {shell: imports, uid: data.user.databaseId, skipped, authoring: data.shared["commits.authoring"], timeout, rest, context, categories}).run({repositories})
}

/**GraphQL batch analyzer (fastest, fetches multiple repos in one query) */
export async function graphqlBatch({login, data, imports, rest, graphql, context, repositories}, {skipped, categories, timeout}) {
  return new GraphQLBatchAnalyzer(login, {shell: imports, uid: data.user.databaseId, skipped, authoring: data.shared["commits.authoring"], timeout, rest, graphql, context, categories}).run({repositories})
}

/**Indepth analyzer (slow, clones repositories and analyzes commit-by-commit) */
export async function indepth({login, data, imports, rest, context, repositories}, {skipped, categories, timeout}) {
  return new IndepthAnalyzer(login, {shell: imports, uid: data.user.databaseId, skipped, authoring: data.shared["commits.authoring"], timeout, rest, context, categories}).run({repositories})
}

/**Recent languages activity */
export async function recent({login, data, imports, rest, context, account}, {skipped = [], categories, days = 0, load = 0, timeout}) {
  return new RecentAnalyzer(login, {shell: imports, uid: data.user.databaseId, skipped, authoring: data.shared["commits.authoring"], timeout, account, rest, context, days, categories, load}).run()
}

//import.meta.main
if (/languages.analyzers.mjs$/.test(process.argv[1])) {
  ;(async () => {
    console.log(await cli())
    process.exit(0)
  })()
}
