#!/bin/bash
# Cut hook clips to 1080x1920 @24fps and apply the round-1 grades.
set -e
O=motion/public/clips
BASE="scale=1080:1920:flags=lanczos,fps=24"
LUSH="colorbalance=rs=0.04:bs=-0.06:rm=0.09:gm=0.02:bm=-0.10:rh=0.05:gh=0.01:bh=-0.06,eq=contrast=0.96:saturation=1.18:gamma=1.03,curves=all='0/0.04 0.5/0.53 1/0.97'"
FILM="colorbalance=rs=0.05:bs=-0.02:rm=0.07:bm=-0.08:rh=0.07:gh=0.03:bh=-0.05,eq=contrast=0.86:saturation=0.85,curves=all='0/0.09 0.5/0.53 1/0.93',noise=alls=6:allf=t"
BRIGHT="colorbalance=rm=0.04:bm=-0.05:rh=0.03:bh=-0.03,eq=contrast=1.03:saturation=1.06:brightness=0.04,curves=all='0/0.0 0.5/0.58 1/1'"
cut(){ ffmpeg -v error -y -ss 0 -t $2 -i footage/$1.mp4 -vf "$BASE${3:+,$3}" -c:v libx264 -crf 14 -preset fast -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 $O/$4.mp4; }
cut view-you-pay-for 3.4 "" view_orig
cut view-you-pay-for 3.4 "$LUSH" view_lush
cut view-you-pay-for 3.4 "$FILM" view_film
cut view-you-pay-for 3.4 "$BRIGHT" view_bright
cut apologizing-for-reaching-out 4.6 "$LUSH" apol_lush
cut apologizing-for-reaching-out 4.6 "" apol_orig
cut highest-offer 3.2 "" offer_orig
