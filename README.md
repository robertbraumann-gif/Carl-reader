# Carl Reader

Private mobile EPUB reading assistant for a legally purchased DRM-free EPUB. The EPUB itself stays in the browser and is never committed to this repository. Only the currently requested text chunk is sent to the server-side OpenAI translation endpoint.

## Goals

- Reliable EPUB import on iPhone/Safari without CDN dependencies.
- Extract the real EPUB spine/chapters and preserve paragraph structure.
- Comfortable book-like reading UI: page-sized chunks, previous/next/swipe, font size, light/sepia/dark, reading progress.
- Original/German toggle.
- Server-side OpenAI translation; API key never exposed to the browser.
- Translation cache in IndexedDB/local storage so a chunk is paid for once.
- Pre-translate the next chunk while reading.
- Docker/Compose deployment on the existing host, isolated from CreatorLive, behind Caddy.

## Security

Never commit `.env`, API keys, passwords, or purchased EPUB files. `.gitignore` blocks them.

## Local run

Copy `.env.example` to `.env`, set secrets, then:

```bash
docker compose up --build
```

Health: `http://127.0.0.1:3011/api/health`

## Reverse proxy

Suggested Caddy route:

```caddy
reader.creatorlive.org {
  reverse_proxy 127.0.0.1:3011
}
```

## Acceptance criteria

1. The supplied test EPUB can be selected on iPhone Safari and loads without an external JSZip CDN.
2. Chapter/spine extraction succeeds on the real file and does not regress to the earlier ZIP/data-descriptor error.
3. A short mock translation test passes without OpenAI.
4. With `OPENAI_API_KEY` configured, a real Italian sample returns German from `/api/translate`.
5. Reader UI is usable one-handed on iPhone and no chapter is rendered as one enormous wall of text.
6. Docker healthcheck passes.
7. No copyrighted EPUB content, API keys, or secrets are committed.
