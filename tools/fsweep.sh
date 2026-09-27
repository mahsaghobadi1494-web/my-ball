#!/bin/sh
# tools/fsweep.sh - sweep ONE numeric skill field over a list of values.
#
#   sh tools/fsweep.sh <field> <v1,v2,v3> <baseTier> <opponent> [seeds] [min] [off] [stride]
#   e.g. sh tools/fsweep.sh react 0.15,0.19,0.23,0.27,0.31 2 tier:1 16 4 5000 131
#
# Builds the base tier's genome with the field set to each value and measures it
# against the opponent with tools/ab.mjs (the single measurement authority).
#
# Read the SHAPE, not the best value. A smooth monotone response with a knee is a
# mechanism; a jagged one (good, bad, good) is chaos and the "best" value is
# noise you must not ship.
set -u
FIELD=${1:-react}
VALS=${2:-0.15,0.19,0.23,0.27,0.31}
B=${3:-2}
OPP=${4:-tier:1}
S=${5:-16}
M=${6:-4}
O=${7:-5000}
T=${8:-131}

echo "base tier $B   field $FIELD   opponent $OPP   family $O+${T}n"
for V in $(echo "$VALS" | tr ',' ' '); do
  node --input-type=module -e "
    import { AI_LEVELS } from './src/game/ai.js'; import fs from 'fs';
    const g = JSON.parse(JSON.stringify(AI_LEVELS[$B]));
    g['$FIELD'] = $V;
    fs.writeFileSync('/tmp/sw.json', JSON.stringify(g));
  "
  echo "---- $FIELD = $V"
  node tools/ab.mjs /tmp/sw.json "$OPP" "$S" "$M" "$O" "$T" 4 2>&1 | grep -E "goals|seeds"
done
