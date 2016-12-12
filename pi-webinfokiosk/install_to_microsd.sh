#!/bin/zsh
[[ -z $1 || -z $2 || -z $3 || -z $4 ]] && echo "usage <kiosk id> <boot-mntpnt> <root-mntpnt> <home-mntpnt>" && exit 1
BOOTM=$2
ROOTM=$3
HOMEM=$4
mkdir -p $HOMEM/pi/.config/systemd/ $HOMEM/pi/.local/share/systemd/user
sudo cp spectrwm.conf fstab $ROOTM/etc/
sudo cp modules.$1 $ROOTM/etc/modules
sudo cp start-kiosk.sh.$1 $ROOTM/usr/local/bin/start-kiosk.sh
sudo cp config.txt.$1 $BOOTM/config.txt
#sudo cp restart_kiosk $ROOTM/etc/cron.d/
sudo chmod +x $ROOTM/usr/local/bin/start-kiosk.sh
cp startx.service restartx.service restartx.timer $HOMEM/pi/.local/share/systemd/user
cp install_debian_pkgs.sh $HOMEM/pi/
echo "boot and login and run install_debian_pkgs.sh locally"

