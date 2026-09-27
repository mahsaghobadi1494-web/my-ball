#!/bin/sh
# tools/field_sweep.sh - sweep ONE AI_LEVELS field and report motion + shot quality.
#
#   sh tools/field_sweep.sh <tier> <field> <v1> <v2> ...
#
# Edits a copy of src/game/ai.js in the tree it is run from, so run it in a
# throwaway worktree, never in the main one. Read the SHAPE of the response
# (monotone = a real mechanism; jagged = chaos) rather than the best single value.
set -e
TIER=$1; FIELD=$2
shift 2
[ $# -ge 1 ] || { echo "usage: field_sweep.sh <tier> <field> <v1> [v2 ...]"; exit 2; }
ROOT=$(cd "$(dirname "$0")/.." && pwd)
BAK="$ROOT/src/game/ai.js.sweepbak"
cp "$ROOT/src/game/ai.js" "$BAK"
restore() { cp "$BAK" "$ROOT/src/game/ai.js"; rm -f "$BAK"; }
trap restore EXIT INT TERM

for V in "$@"; do
  cp "$BAK" "$ROOT/src/game/ai.js"
  node -e '
    var fs=require("fs"), p=process.argv[1], t=+process.argv[2], f=process.argv[3], v=process.argv[4];
    var s=fs.readFileSync(p,"utf8");
    var i=s.indexOf("id: "+t+",");
    if(i<0){ console.error("tier "+t+" not found"); process.exit(1); }
    var seg=s.slice(i,i+900);
    var already=new RegExp(f+": "+v.replace(/\./g,"\\.")+"(?![0-9.])");
    if(!already.test(seg)){
      var re=new RegExp("("+f+": )([0-9.]+)");
      if(!re.test(seg)){ console.error("field "+f+" not found in tier "+t); process.exit(1); }
      seg=seg.replace(re,"$1"+v);
      s=s.slice(0,i)+seg+s.slice(i+900);
      fs.writeFileSync(p,s);
    }
  ' "$ROOT/src/game/ai.js" "$TIER" "$FIELD" "$V"
  echo "### $FIELD = $V"
  node "$ROOT/tools/motion.mjs" "$TIER" 3 4 3 2>/dev/null \
    | grep -E "speed |fastFrac|boostHeld|turnFrac|alignFrac|firstTouch"
  node "$ROOT/tools/quality.mjs" "$TIER" 4 3 2>/dev/null \
    | grep -E "shots|on target|goals|accuracy|territory"
done
