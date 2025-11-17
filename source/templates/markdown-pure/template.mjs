/**Template processor for Markdown Pure SVG */
export default async function(_, {data}, {imports}) {
  //Core
  await imports.plugins.core(...arguments)

  //Aliases for markdown content
  const {user, computed, plugins, config} = data

  // Set up markdown content from various sources
  if (!config.markdown && !data.markdown) {
    // Default example markdown if no content provided
    config.markdown = `# Welcome to Markdown Pure SVG

This template renders markdown as pure SVG for ultra-fast Satori rendering.

## Features

- Pure SVG rendering (no foreignObject)
- 10-100x faster than traditional templates
- Clean, readable markdown display
- Perfect for CI/CD workflows

## Code Example

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

## Quick Stats

- User: ${user.login}
- Repositories: ${user.repositories.totalCount}
- Followers: ${user.followers.totalCount}

---

Generated with lowlighter/metrics
`
  }

  // Extend data with markdown-specific aliases
  Object.assign(data, {
    //Base
    NAME: user.name,
    LOGIN: user.login,
    REGISTRATION_DATE: user.createdAt,
    LOCATION: user.location,
    REPOSITORIES: user.repositories.totalCount,
    FOLLOWERS: user.followers.totalCount,
    FOLLOWING: user.following.totalCount,

    //Computed
    AVATAR: computed.avatar,
    REGISTRATION: computed.registration,

    //Version
    VERSION: data.meta.version,
  })
}
