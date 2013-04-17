#!/bin/sh
KIOSKURI="http://www.realraum.at/kiosk.html"
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

unclutter &
#midori -e Fullscreen -a "$KIOSKURI"
chromium --kiosk --incognito "$KIOSKURI"

exit 0
