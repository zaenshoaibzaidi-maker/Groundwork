#!/bin/bash
# regenerate-all.sh — Regenerate AI strategy briefs for the empty districts
# left behind by fix-oklahoma-briefs.js, one state at a time.
#
# Usage: ./regenerate-all.sh

set -e

STATES="ak al ar co ct de fl ga ia id il in ks ky la me mi mn mo ms mt nc ne nh nm or pa sc sd tn va vt wa wi wv wy"

for state in $STATES; do
  echo "=== $state ==="
  node generate-briefs.js "${state}-districts.js"
done
