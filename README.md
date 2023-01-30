# Fediverse Explorer

Browse most recent public posts across the fediverse.

This tool is a prototype and under active development. Currently only supports Mastodon instances. No data is saved on this server.

## How it works

This tool parses the built-in RSS feed for each searched tag and selected instances. 

```
https://mastodon.social/tags/dataviz.rss
```

## Development

```sh
npm install
nodemon -L
```