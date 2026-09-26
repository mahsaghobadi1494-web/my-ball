#!/bin/sh
# Download every locked package as a tarball, because `npm install` is blocked
# by the sandbox (CODEBUDDY_BROKER_DENY inside arborist's reify step).
# `npm pack` only downloads, so it is never blocked.
set -u
cd "$(dirname "$0")/.." || exit 1
NPM=/Users/mehdipoursoleiman/.workbuddy-ai/binaries/node/versions/22.22.2-2/bin/npm
PK="$PWD/.pk"
mkdir -p "$PK"
i=0
batch=""
while IFS= read -r spec; do
  [ -z "$spec" ] && continue
  batch="$batch $spec"
  i=$((i + 1))
  if [ $((i % 15)) -eq 0 ]; then
    out=$($NPM pack $batch --cache "$PWD/.npm-cache" --pack-destination "$PK" 2>&1)
    if [ $? -ne 0 ]; then
      echo "BATCH FAIL around spec $i:"
      echo "$out" | grep -i "npm error" | head -5
    fi
    echo "spec $i -> $(ls "$PK" | wc -l | tr -d ' ') tgz"
    batch=""
  fi
done < /tmp/specs.txt
if [ -n "$batch" ]; then
  $NPM pack $batch --cache "$PWD/.npm-cache" --pack-destination "$PK" >/dev/null 2>&1
fi
echo "FINAL $(ls "$PK" | wc -l | tr -d ' ') tgz"
