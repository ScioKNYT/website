#!/usr/bin/env bash

# 1. Fetch the full Git history so Hugo can see 'Last Updated' dates
# We check if it's a shallow clone first to avoid errors
if [ "$(git rev-parse --is-shallow-repository)" == "true" ]; then
  echo "Unshallowing repository for Git metadata..."
  git fetch --unshallow
fi

# 2. Determine the Base URL
if [ "$CF_PAGES_BRANCH" == "main" ]; then
  HUGO_BASEURL=https://website-29s.pages.dev
else
  HUGO_BASEURL=$CF_PAGES_URL
fi

echo "Building with BaseURL: $HUGO_BASEURL"

# 3. Run Hugo build
hugo --gc --minify -b $HUGO_BASEURL --enableGitInfo
