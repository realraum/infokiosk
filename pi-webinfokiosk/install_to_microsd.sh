#!/bin/zsh
[[ -z $1 || -z $2 || -z $3 || -z $4 ]] && echo "usage <kiosk id> <boot-mntpnt> <root-mntpnt> <home-mntpnt>" && exit 1
BOOTM=$2
ROOTM=$3
HOMEM=$4
mkdir -p $HOMEM/pi/.config/systemd/user $HOMEM/pi/.local/share/systemd/user $HOMEM/pi/.ssh
sudo cp spectrwm.conf fstab $ROOTM/etc/
sudo cp modules.$1 $ROOTM/etc/modules
sudo cp start-kiosk.sh.$1 $ROOTM/usr/local/bin/start-kiosk.sh
sudo cp config.txt.$1 $BOOTM/config.txt
sudo cp interface_usb0.$1 $ROOTM/etc/network/interfaces.d/usb0
echo kiosk$1.realraum.at | sudo tee $ROOTM/etc/hostname
cat ~/.ssh/id*.pub > $HOMEM/pi/.ssh/authorized_keys
cp ~/.zshrc ~/.zshrc.local $HOMEM/pi/
sudo chown 1000:1000 $HOMEM/pi/.zshrc*
chmod 600 $HOMEM/pi/.ssh/authorized_keys
#sudo cp restart_kiosk $ROOTM/etc/cron.d/
sudo chmod +x $ROOTM/usr/local/bin/start-kiosk.sh
cp startx.service restartx.service restartx.timer $HOMEM/pi/.local/share/systemd/user
cp install_debian_pkgs.sh $HOMEM/pi/
sudo ln -s /lib/systemd/system/getty@.service $ROOTM/etc/systemd/system/getty.target.wants/getty@ttyGS0.service 
sudo ln -s /lib/systemd/system/ssh.service $ROOTM/etc/systemd/system/sshd.service
echo "boot and login and run passwd; install_debian_pkgs.sh locally"

