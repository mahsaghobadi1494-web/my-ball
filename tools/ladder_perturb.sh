#!/bin/sh
# tools/ladder_perturb.sh - is the tier ladder REAL, or is it chaos-fitting?
#
#   sh tools/ladder_perturb.sh [seeds] [minutes] [offset] [stride] [perturb]
#
# Same six pairings as ladder_matrix.sh, but each side is replaced by the MEAN
# over K=5 perturbed copies of its own genome (every numeric field scaled by
# exp(u), u uniform in [-perturb, +perturb]). A real, robust ordering survives
# that neighbourhood average; an ordering that only exists at one exact set of
# floats collapses toward zero.
#
# Both sides are perturbed with the SAME copy index, so this compares a
# neighbourhood against a neighbourhood rather than a point against a cloud.
#
# Interpret: if the ladder's sign pattern survives here, the ordering is a real
# property of the shipped values. If it dissolves into "inside noise", the
# ordering is a coincidence of specific floats and must not be tuned against.
set -u
S=${1:-16}
M=${2:-4}
O=${3:-5000}
T=${4:-131}
P=${5:-0.01}

for PAIR in "1 0" "2 1" "3 2" "4 3" "2 0" "4 2"; do
  set -- $PAIR
  echo "=============================================================="
  echo "### tier:$1  vs  tier:$2     (perturb +/-$(echo "$P * 100" | bc)%)"
  echo "=============================================================="
  node tools/ab.mjs "tier:$1" "tier:$2" "$S" "$M" "$O" "$T" 4 "$P" 2>&1 \
    | grep -v "deprecated with r150" | grep -E "goals|seeds"
done
