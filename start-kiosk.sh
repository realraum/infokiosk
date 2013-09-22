#!/bin/sh
KIOSKURI_DEFAULT="http://www.realraum.at/kiosk.html"
KIOSKURI_900x1440="http://www.realraum.at/kiosk.html"
KIOSKURI_768x1366="http://www.realraum.at/kiosk768x1366.html"
KIOSKURI_1024x768="http://www.realraum.at/kiosk2cal.html"
#KIOSKURI="http://grical.realraum.at"
#KIOSKURI="http://radi-o-matic.helsinki.at/nextshows/index.php?len=11"
sleep 1

killall midori 2> /dev/null
killall unclutter 2> /dev/null
killall chromium 2> /dev/null

sleep 5
export DISPLAY=:0.0

xset dpms 0 0 0
xset dpms force on
xset s off
xset s noblank
RESOLUTION=$(xrandr -q | awk -F'current' -F',' 'NR==1 {gsub("( |current)","");print $2}')
KIOSKURI=$(eval echo -n \${KIOSKURI_${RESOLUTION}:-$KIOSKURI_DEFAULT})
unclutter &
#midori -e Fullscreen -a "$KIOSKURI"
chromium --kiosk --incognito "$KIOSKURI"

exit 0
