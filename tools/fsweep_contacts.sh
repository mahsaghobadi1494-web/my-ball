#!/bin/sh
# tools/fsweep_contacts.sh - how does ONE AI_LEVELS field affect same-team contacts?
#
#   sh tools/fsweep_contacts.sh <tier> <teamSize> <seeds> <minutes> <field> <v1> <v2> ...
#
# Reads the SHAPE of the response, not the best value. A smooth monotone curve is
# a mechanism and can be tuned; a jagged one (good/bad/good at neighbouring
# values) is chaos and must not be tuned - pick the value on the other merits.
#
# Rewrites src/game/ai.js in place for each value and restores it on exit, so run
# it inside a throwaway worktree, never in the working tree.
set -e
TIER=$1; TS=$2; NSEED=$3; MIN=$4; FIELD=$5
shift 5
if [ $# -eq 0 ]; then echo "usage: fsweep_contacts.sh <tier> <TS> <seeds> <min> <field> <v...>"; exit 2; fi

ROOT=$(cd "$(dirname "$0")/.." && pwd)
SRC="$ROOT/src/game/ai.js"
BAK="$SRC.sweepbak"
cp "$SRC" "$BAK"
restore() { cp "$BAK" "$SRC"; rm -f "$BAK"; }
trap restore EXIT INT TERM

for V in "$@"; do
  cp "$BAK" "$SRC"
  node -e '
    var fs = require("fs"), p = process.argv[1], t = process.argv[2],
        f = process.argv[3], v = process.argv[4];
    var s = fs.readFileSync(p, "utf8");
    var i = s.indexOf("id: " + t + ",");
    if (i < 0) { console.error("tier not found"); process.exit(1); }
    var seg = s.slice(i, i + 900);
    if (!new RegExp(f + ": [0-9.]+").test(seg)) {
      console.error("field not found in tier block"); process.exit(1);
    }
    // Setting a field to the value it already has is a legitimate no-op, not an
    // error - the tier block is simply already correct.
    var seg2 = seg.replace(new RegExp(f + ": [0-9.]+"), f + ": " + v);
    fs.writeFileSync(p, s.slice(0, i) + seg2 + s.slice(i + 900));
  ' "$SRC" "$TIER" "$FIELD" "$V"
  echo "### $FIELD = $V"
  node "$ROOT/tools/mates.mjs" "$TIER" "$TS" "$NSEED" "$MIN" 2>/dev/null \
    | grep -E "teamHit|oppHit|matePass|teamStay|goals"
done
