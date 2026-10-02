#!/usr/bin/env bash
# Garante o Ollama instalado e rodando para o `npm run translate` (só máquina do autor).
# Roda no `postinstall`. Nunca quebra o `npm install`: problemas viram aviso.
#
#   SKIP_OLLAMA_SETUP=1  pula tudo
#   CI=true              pula tudo (build da Cloudflare)
#   OLLAMA_HOST=...      se não for local, só confere se responde (não instala nada)
#   OLLAMA_MODEL=...     modelo esperado (padrão qwen3:14b); nunca é baixado aqui

set -u

HOST="${OLLAMA_HOST:-http://localhost:11434}"
case "$HOST" in http://* | https://*) ;; *) HOST="http://$HOST" ;; esac
MODEL="${OLLAMA_MODEL:-qwen3:14b}"

say() { printf '[ollama] %s\n' "$*"; }
up() { curl -fsS -m 2 "$HOST/api/version" >/dev/null 2>&1; }

if [ -n "${SKIP_OLLAMA_SETUP:-}" ] || [ -n "${CI:-}" ]; then
  exit 0
fi

check_model() {
  if ! curl -fsS -m 2 "$HOST/api/tags" 2>/dev/null | grep -q "\"$MODEL\""; then
    say "modelo $MODEL ainda não baixado (~9 GB). Rode: ollama pull $MODEL"
  fi
}

# Caminho rápido: já está respondendo.
if up; then
  check_model
  exit 0
fi

# Host remoto (ex.: acer-server na LAN): não há o que instalar aqui.
case "$HOST" in
  *://localhost* | *://127.0.0.1* | *://0.0.0.0*) ;;
  *)
    say "aviso: $HOST não responde; confira o servidor remoto."
    exit 0
    ;;
esac

# Instalação.
if ! command -v ollama >/dev/null 2>&1; then
  if [ "$(uname -s)" = "Darwin" ] && command -v brew >/dev/null 2>&1; then
    say "instalando via Homebrew (uma vez só)..."
    if ! HOMEBREW_NO_AUTO_UPDATE=1 brew install ollama >/dev/null; then
      say "aviso: brew install ollama falhou; instale à mão: https://ollama.com/download"
      exit 0
    fi
  else
    say "aviso: Ollama não instalado. Instale: https://ollama.com/download (Linux: curl -fsSL https://ollama.com/install.sh | sh)"
    exit 0
  fi
fi

# Subir o servidor.
say "iniciando o servidor..."
if [ "$(uname -s)" = "Darwin" ] && command -v brew >/dev/null 2>&1 &&
  brew list --formula ollama >/dev/null 2>&1; then
  brew services start ollama >/dev/null 2>&1
elif [ -d "/Applications/Ollama.app" ]; then
  open -ga Ollama
else
  nohup ollama serve >/dev/null 2>&1 &
fi

for _ in $(seq 1 20); do
  if up; then
    say "rodando em $HOST"
    check_model
    exit 0
  fi
  sleep 0.5
done

say "aviso: o Ollama não respondeu em $HOST; tente 'ollama serve'."
exit 0
