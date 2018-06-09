#!/bin/sh
KIOSKURI_DEFAULT="http://www.realraum.at/kiosk900x1440.html"
KIOSKURI_900x1440="http://www.realraum.at/kiosk900x1440.html"
KIOSKURI_768x1366="http://www.realraum.at/kiosk768x1366.html"
KIOSKURI_1024x768="http://www.realraum.at/kiosk1024x768.html"
KIOSKURI_1680x1050="http://www.realraum.at/kiosk1680x1050_2.html"
KIOSKURI_1050x1680="http://www.realraum.at/kiosk1050x1680_2.html"

#KIOSKURI="http://grical.realraum.at"
#KIOSKURI="http://radi-o-matic.helsinki.at/nextshows/index.php?len=11"
sleep 1

killall epiphany-browser 2> /dev/null
killall unclutter 2> /dev/null

sleep 5
export DISPLAY=:0.0

xset dpms 0 0 0
xset dpms force on
xset s off
xset s noblank
RESOLUTION=$(xrandr -q | awk -F'current' -F',' 'NR==1 {gsub("( |current)","");print $2}')
KIOSKURI=$(eval echo -n \${KIOSKURI_${RESOLUTION}:-$KIOSKURI_DEFAULT})
spectrwm &
unclutter &
rm -Rf /run/user/1000/browser
mkdir -p /run/user/1000/browser
mkdir -p /run/user/1000/browsercache
#epiphany --profile /run/user/1000/browser  -a "$KIOSKURI"
#midori -e Fullscreen -a "$KIOSKURI"
cat > /run/user/1000/browser/Preferences <<EOF
{"first_run": false,"translate":{"enabled":false},"translate_blocked_languages":["de","en"]}
EOF
chmod 600 /run/user/1000/browser/Preferences
#export LANG=de_AT.UTF-8
chromium-browser --kiosk --incognito --disable --disable-translate --disable-infobars --disable-suggestions-service --disable-save-password-bubble --disk-cache-dir=/run/user/1000/browsercache --user-data-dir=/run/user/1000/browser --start-maximized    "$KIOSKURI"
exit 0

