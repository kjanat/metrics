//Imports
import { Analyzer } from "./analyzer.mjs"

/**
 * API-based analyzer using GitHub's pre-computed language statistics
 * This is significantly faster than the indepth analyzer as it uses
 * GitHub's /repos/{owner}/{repo}/languages endpoint which returns
 * pre-aggregated language data computed by GitHub's Linguist.
 */
export class ApiAnalyzer extends Analyzer {
  /**Constructor */
  constructor() {
    super(...arguments)
    this.cache = {languages: {}, colors: {}}
  }

  /**Run analyzer */
  run({repositories}) {
    return super.run(async () => {
      for (const repository of repositories) {
        if (this.results.partial.global)
          break
        if (this.ignore(repository))
          continue
        await this.fetchLanguages(repository)
      }
    })
  }

  /**Fetch language statistics from GitHub API */
  async fetchLanguages(repository) {
    const {repo} = this.parse(repository)
    const [owner, name] = repo.split("/")

    try {
      this.debug(`fetching language statistics for ${repo} via REST API`)

      // Use GitHub's pre-computed language statistics endpoint
      // This is orders of magnitude faster than cloning and analyzing
      const {data: languages} = await this.rest.repos.listLanguages({
        owner,
        repo: name
      })

      // Aggregate the statistics
      for (const [language, bytes] of Object.entries(languages)) {
        this.results.stats[language] = (this.results.stats[language] ?? 0) + bytes
        this.results.total += bytes

        // We don't get line counts from the API, but we can estimate based on bytes
        // Using a rough heuristic of ~50 bytes per line of code
        const estimatedLines = Math.round(bytes / 50)
        this.results.lines[language] = (this.results.lines[language] ?? 0) + estimatedLines
      }

      // Fetch repository details to get language colors if needed
      if (Object.keys(this.results.colors).length === 0 || !Object.keys(languages).every(lang => lang in this.results.colors)) {
        try {
          const {data: repoData} = await this.rest.repos.get({
            owner,
            repo: name
          })

          // Note: The REST API doesn't provide individual language colors
          // We'll rely on the GraphQL data or use defaults
          this.debug(`fetched repository data for ${repo}`)
        }
        catch (error) {
          this.debug(`failed to fetch repository details for ${repo} (${error.message})`)
        }
      }

      this.debug(`processed ${Object.keys(languages).length} languages for ${repo}`)
    }
    catch (error) {
      this.debug(`failed to fetch languages for ${repo} (${error.message})`)
      this.results.missed.commits++
    }
  }
}

/**
 * GraphQL-based batch analyzer using GitHub's GraphQL API
 * This analyzer fetches multiple repositories in a single query,
 * which is even faster than individual REST API calls.
 */
export class GraphQLBatchAnalyzer extends Analyzer {
  /**Constructor */
  constructor(login, options) {
    super(login, options)
    this.graphql = options.graphql
    this.batchSize = 50 // GitHub's GraphQL API can handle ~50-100 repos per query
  }

  /**Run analyzer */
  run({repositories}) {
    return super.run(async () => {
      // Split repositories into batches
      const batches = []
      for (let i = 0; i < repositories.length; i += this.batchSize) {
        batches.push(repositories.slice(i, i + this.batchSize))
      }

      // Process each batch
      for (const batch of batches) {
        if (this.results.partial.global)
          break
        await this.fetchLanguagesBatch(batch)
      }
    })
  }

  /**Fetch language statistics for multiple repositories in a single GraphQL query */
  async fetchLanguagesBatch(repositories) {
    try {
      // Filter out repositories to skip
      const validRepos = repositories.filter(repo => !this.ignore(repo))
      if (validRepos.length === 0)
        return

      this.debug(`fetching language statistics for ${validRepos.length} repositories via GraphQL`)

      // Build GraphQL query for batch fetching
      const queries = validRepos.map((repository, index) => {
        const {repo} = this.parse(repository)
        const [owner, name] = repo.split("/")
        return `
          repo${index}: repository(owner: "${owner}", name: "${name}") {
            name
            owner { login }
            languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
              totalSize
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
          }
        `
      }).join("\n")

      const query = `query {
        ${queries}
      }`

      // Execute the batch query
      const result = await this.graphql(query)

      // Process results
      for (const [key, repoData] of Object.entries(result)) {
        if (!key.startsWith("repo") || !repoData)
          continue

        const {languages} = repoData
        if (!languages)
          continue

        // Aggregate language statistics
        for (const {size, node: {name: language, color}} of languages.edges) {
          this.results.stats[language] = (this.results.stats[language] ?? 0) + size
          this.results.total += size

          // Estimate line counts (rough heuristic: ~50 bytes per line)
          const estimatedLines = Math.round(size / 50)
          this.results.lines[language] = (this.results.lines[language] ?? 0) + estimatedLines

          // Store color information
          if (color && !this.results.colors[language])
            this.results.colors[language] = color
        }
      }

      this.debug(`processed ${validRepos.length} repositories via GraphQL batch query`)
    }
    catch (error) {
      this.debug(`failed to fetch languages batch via GraphQL (${error.message})`)
      // Fallback to individual REST API calls if batch fails
      for (const repository of repositories) {
        if (!this.ignore(repository)) {
          const analyzer = new ApiAnalyzer(this.login, {
            shell: this.shell,
            uid: this.uid,
            skipped: this.skipped,
            authoring: this.authoring,
            timeout: this.timeout,
            rest: this.rest,
            context: this.context,
            categories: this.categories
          })
          try {
            await analyzer.fetchLanguages(repository)
            // Merge results
            for (const [lang, value] of Object.entries(analyzer.results.stats)) {
              this.results.stats[lang] = (this.results.stats[lang] ?? 0) + value
            }
            for (const [lang, value] of Object.entries(analyzer.results.lines)) {
              this.results.lines[lang] = (this.results.lines[lang] ?? 0) + value
            }
            Object.assign(this.results.colors, analyzer.results.colors)
            this.results.total += analyzer.results.total
          }
          catch (error) {
            this.debug(`failed to fetch languages for repository (${error.message})`)
          }
        }
      }
    }
  }
}
