#!/bin/zsh
## (c) Bernhard Tittelbach 2017

local TARGETIMAGE=${1}
local BBHOSTNAME=${2:-kiosk3.realraum.at}
local MOUNTPTH=$(mktemp -d)
local APTSCRIPT=./aptscript_kiosk23.sh
local CONFIGTXTAPPEND=./config.txt.kiosk3.append
local LOCALROOT=./rootfs-kiosk3
local MYSSHPUBKEY=~/.ssh/id_ed25519.pub
local NODHCPONINTERFACE="usb0"

. ./modify_image_include.sh
