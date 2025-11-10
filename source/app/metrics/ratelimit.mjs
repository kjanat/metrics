/**
 * Smart rate limit manager for GitHub API
 * Monitors actual API usage and only delays when approaching limits
 * This is significantly more efficient than fixed delays
 */

export class RateLimitManager {
  constructor(rest, {
    restThreshold = 0.2, // Start throttling when 20% of requests remain
    graphqlThreshold = 0.2, // Start throttling when 20% of points remain
    checkInterval = 60000, // Check rate limits every minute
  } = {}) {
    this.rest = rest
    this.restThreshold = restThreshold
    this.graphqlThreshold = graphqlThreshold
    this.checkInterval = checkInterval
    this.lastCheck = 0
    this.limits = {
      rest: {remaining: 5000, limit: 5000, reset: Date.now() + 3600000},
      graphql: {remaining: 5000, limit: 5000, reset: Date.now() + 3600000},
    }
  }

  /**
   * Check current rate limits from GitHub API
   */
  async checkLimits() {
    const now = Date.now()

    // Only check if we haven't checked recently
    if (now - this.lastCheck < this.checkInterval) {
      return this.limits
    }

    try {
      const {data} = await this.rest.rateLimit.get()
      this.limits = {
        rest: {
          remaining: data.resources.core.remaining,
          limit: data.resources.core.limit,
          reset: data.resources.core.reset * 1000,
        },
        graphql: {
          remaining: data.resources.graphql.remaining,
          limit: data.resources.graphql.limit,
          reset: data.resources.graphql.reset * 1000,
        },
      }
      this.lastCheck = now

      console.debug(`metrics/ratelimit > REST: ${this.limits.rest.remaining}/${this.limits.rest.limit}, GraphQL: ${this.limits.graphql.remaining}/${this.limits.graphql.limit}`)
    }
    catch (error) {
      console.debug(`metrics/ratelimit > failed to check rate limits: ${error.message}`)
    }

    return this.limits
  }

  /**
   * Check if we should throttle requests
   */
  async shouldThrottle(type = "rest") {
    const limits = await this.checkLimits()
    const {remaining, limit} = limits[type] ?? limits.rest

    // Check if we're below threshold
    const ratio = remaining / limit
    return ratio < (type === "rest" ? this.restThreshold : this.graphqlThreshold)
  }

  /**
   * Calculate optimal delay based on current rate limit status
   * Returns delay in milliseconds
   */
  async calculateDelay(type = "rest") {
    const limits = await this.checkLimits()
    const {remaining, limit, reset} = limits[type] ?? limits.rest

    // If we have plenty of requests remaining, no delay needed
    const ratio = remaining / limit
    const threshold = type === "rest" ? this.restThreshold : this.graphqlThreshold

    if (ratio > threshold) {
      return 0
    }

    // Calculate time until reset
    const timeUntilReset = reset - Date.now()

    // If we're close to the limit, calculate delay to spread requests until reset
    if (remaining < 100) {
      // Spread remaining requests evenly until reset
      return Math.max(0, Math.floor(timeUntilReset / Math.max(1, remaining)))
    }

    // Otherwise, use exponential backoff based on how close we are to the limit
    const urgency = 1 - ratio / threshold // 0 to 1, where 1 is most urgent
    const baseDelay = 1000 // 1 second base delay
    const maxDelay = 60000 // 60 seconds max delay

    return Math.min(maxDelay, Math.floor(baseDelay * Math.pow(2, urgency * 5)))
  }

  /**
   * Wait if necessary before making a request
   */
  async waitIfNeeded(type = "rest") {
    const delay = await this.calculateDelay(type)

    if (delay > 0) {
      console.debug(`metrics/ratelimit > throttling ${type} requests, waiting ${(delay / 1000).toFixed(1)}s`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    return delay
  }

  /**
   * Execute a function with automatic rate limiting
   */
  async execute(fn, {type = "rest", retries = 3} = {}) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        // Wait if we're approaching rate limits
        await this.waitIfNeeded(type)

        // Execute the function
        return await fn()
      }
      catch (error) {
        // If we hit a rate limit error, wait and retry
        if (error.status === 403 || error.status === 429) {
          const retryAfter = error.response?.headers?.["retry-after"]
          const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, attempt) * 1000

          console.debug(`metrics/ratelimit > rate limit exceeded, waiting ${(delay / 1000).toFixed(1)}s before retry ${attempt + 1}/${retries}`)
          await new Promise(resolve => setTimeout(resolve, delay))

          // Force a rate limit check after hitting a limit
          this.lastCheck = 0
          await this.checkLimits()

          if (attempt === retries - 1) {
            throw error
          }
        }
        else {
          throw error
        }
      }
    }
  }

  /**
   * Get current rate limit status as a summary
   */
  async getStatus() {
    const limits = await this.checkLimits()
    const now = Date.now()

    return {
      rest: {
        ...limits.rest,
        percentage: (limits.rest.remaining / limits.rest.limit * 100).toFixed(1),
        resetIn: Math.max(0, Math.floor((limits.rest.reset - now) / 1000)),
      },
      graphql: {
        ...limits.graphql,
        percentage: (limits.graphql.remaining / limits.graphql.limit * 100).toFixed(1),
        resetIn: Math.max(0, Math.floor((limits.graphql.reset - now) / 1000)),
      },
    }
  }
}

/**
 * Create a rate limit manager instance
 */
export function createRateLimitManager(rest, options) {
  return new RateLimitManager(rest, options)
}
