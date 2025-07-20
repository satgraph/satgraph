# Satgraph

## Run from source

    npm run start

## Create and run from macOS app bundle

    npm run package
    open out/satgraph-darwin-arm64/satgraph.app

## Package app bundle as zip distribution

    npm run make
    open out/make/zip/darwin/arm64/satgraph-darwin-arm64-0.1.0.zip

## Publish zip distribution to GitHub Releases

    export GITHUB_TOKEN=[GitHub Personal Access Token]
    npm run publish
    open https://github.com/satgraph/satgraph/releases
