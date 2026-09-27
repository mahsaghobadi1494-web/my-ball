#!/bin/sh
# tools/ladder_matrix.sh - run a set of adjacent + non-adjacent tier pairings
# through the paired both-direction instrument, sequentially (4-core box).
#
#   sh tools/ladder_matrix.sh <seeds> <minutes> <offset> <stride>
#
# Serialised on purpose: ab.mjs already forks 4 shards, and this machine has 4
# cores, so running two ab.mjs at once just makes both slower.
set -u
S=${1:-16}
M=${2:-4}
O=${3:-5000}
T=${4:-131}

for P in "1 0" "2 1" "3 2" "4 3" "2 0" "4 2"; do
  set -- $P
  echo "=============================================================="
  echo "### tier:$1  vs  tier:$2"
  echo "=============================================================="
  node tools/ab.mjs "tier:$1" "tier:$2" "$S" "$M" "$O" "$T" 4
done
