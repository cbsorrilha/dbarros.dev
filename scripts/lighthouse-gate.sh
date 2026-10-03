#!/usr/bin/env bash
# Hook de pre-push: roda o portão de Lighthouse só quando o push muda o site.
set -euo pipefail

if [ -n "${SKIP_LIGHTHOUSE:-}" ]; then
  echo "[lighthouse] pulado (SKIP_LIGHTHOUSE)"
  exit 0
fi

SITE_PATHS='^(src/|public/|astro\.config\.ts$|package\.json$|package-lock\.json$)'
if upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null); then
  changed=$(git diff --name-only "$upstream"...HEAD)
  if ! echo "$changed" | grep -qE "$SITE_PATHS"; then
    echo "[lighthouse] nada do site mudou desde $upstream; pulando"
    exit 0
  fi
fi

npm run -s build >/dev/null
npm run -s lighthouse
