#!/bin/sh
# tools/fieldprobe.sh - which SINGLE field explains why tier B loses to tier O?
#
#   sh tools/fieldprobe.sh <baseTier> <donorTier> <opponent> [seeds] [min] [off] [stride]
#
# For every numeric skill field, build the base tier's genome with that ONE field
# taken from the donor tier, then measure it against the opponent.
#
# The point: the base tier is normally "better" than the donor on almost every
# field, so borrowing a donor value should normally make it WORSE. Any field whose
# swap makes it BETTER is a field where the donor's value is actually the stronger
# one - i.e. a candidate explanation for the inversion, and a concrete lever.
#
# Measurement is delegated to tools/ab.mjs so there is exactly one implementation
# of the paired both-direction instrument and it cannot drift.
set -u
B=${1:-2}
D=${2:-1}
OPP=${3:-tier:1}
S=${4:-16}
M=${5:-4}
O=${6:-5000}
T=${7:-131}

FIELDS="react ctrl horizon steerK speedFrac boost boostFloor boostDuty aimErr posErr flip shotFlip aerial airDribble pass demo fake defend rotation recover kickoff"

node --input-type=module -e "
import { AI_LEVELS } from './src/game/ai.js';
import fs from 'fs';
const B = $B, D = $D;
const fields = '$FIELDS'.split(' ');
const map = [];
for (const f of fields) {
  const g = JSON.parse(JSON.stringify(AI_LEVELS[B]));
  g[f] = AI_LEVELS[D][f];
  fs.writeFileSync('/tmp/fs_' + f + '.json', JSON.stringify(g));
  map.push(f + ' = ' + AI_LEVELS[B][f] + ' -> ' + AI_LEVELS[D][f]);
}
fs.writeFileSync('/tmp/fs_map.txt', map.join('\n') + '\n');
console.log('base tier ' + B + ' (' + AI_LEVELS[B].name + ') borrowing from tier ' + D + ' (' + AI_LEVELS[D].name + ')');
"

echo "=============================================================="
echo "### REFERENCE: tier:$B unmodified  vs  $OPP"
echo "=============================================================="
node tools/ab.mjs "tier:$B" "$OPP" "$S" "$M" "$O" "$T" 4 2>&1 | grep -E "goals|seeds"

for F in $FIELDS; do
  echo "=============================================================="
  grep "^$F " /tmp/fs_map.txt
  echo "### tier:$B with tier:$D's $F   vs  $OPP"
  echo "=============================================================="
  node tools/ab.mjs "/tmp/fs_$F.json" "$OPP" "$S" "$M" "$O" "$T" 4 2>&1 | grep -E "goals|seeds"
done
