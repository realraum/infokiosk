#!/bin/bash
KIOSKURI_DEFAULT="http://www.realraum.at/kiosk900x1440.html"
KIOSKURI_900x1440="http://www.realraum.at/kiosk900x1440.html"
KIOSKURI_768x1366="http://www.realraum.at/kiosk768x1366.html"
KIOSKURI_1024x768="http://www.realraum.at/kiosk1024x768.html"
KIOSKURI_1680x1050="http://www.realraum.at/kiosk1680x1050_2.html"
KIOSKURI_1050x1680="http://www.realraum.at/kiosk1050x1680_2.html"
#KIOSKURI="http://grical.realraum.at"
sleep 1

killall midori 2> /dev/null
killall unclutter 2> /dev/null
killall chromium 2> /dev/null
killall epiphany 2> /dev/null

sleep 5
export DISPLAY=:0.0

# disable screen blanking
xset dpms 0 0 0
xset dpms force on
xset s off
xset s noblank

# find the right URL for the display resolution
RESOLUTION=$(xrandr -q | awk -F'current' -F',' 'NR==1 {gsub("( |current)","");print $2}')
KIOSKURI=$(eval echo -n \${KIOSKURI_${RESOLUTION}:-$KIOSKURI_DEFAULT})

# hide mouse cursor
unclutter &
# start spectrwm (or any wm) so browser can do fullscreen
spectrwm &
# first try epiphany (which as great touchscreen support) then midori and finally chromium
if [[ -x "$(which epiphany)" ]; then
    mkdir -p /run/user/1000/epiphany
    epiphany --profile /run/user/1000/epiphany  -a "$KIOSKURI"
elif [[ -x "$(which midori)" ]; then 
    midori -e Fullscreen -a "$KIOSKURI"
elif [[ -x "$(which chromium)" ]; then
    chromium --kiosk --incognito "$KIOSKURI"
else
    echo "No Browser found"
    exit 1
fi

exit 0
