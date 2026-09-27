#!/bin/sh
# tools/abl_contacts.sh - attribute the same-team-contact fix to specific code.
#   sh tools/abl_contacts.sh <tier> <teamSize> <seeds> <minutes>
# Requires the temporary AI_ABL scaffold in src/game/ai.js. Sweep worktree only.
set -e
TIER=$1; TS=$2; NSEED=$3; MIN=$4
ROOT=$(cd "$(dirname "$0")/.." && pwd)
for A in 0 1 2 3 4 5 6 7; do
  echo "### AI_ABL=$A  (1=no resting-ball guard, 2=no close-range strike, 4=no latched loop side)"
  AI_ABL=$A node "$ROOT/tools/mates.mjs" "$TIER" "$TS" "$NSEED" "$MIN" 2>/dev/null \
    | grep -E "teamHit|oppHit|matePass|goals"
done
