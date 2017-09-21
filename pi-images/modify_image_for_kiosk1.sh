#!/bin/zsh
## (c) Bernhard Tittelbach 2017

local TARGETIMAGE=${1}
local BBHOSTNAME=${2:-kiosk1.realraum.at}
local MOUNTPTH=$(mktemp -d)
local APTSCRIPT=./aptscript_kiosk1.sh
local CONFIGTXTAPPEND=./config.txt.kiosk1.append
local LOCALROOT=./rootfs-kiosk1
local MYSSHPUBKEY=~/.ssh/id_ed25519.pub
local NODHCPONINTERFACE="eth0"

. ./modify_image_include.sh