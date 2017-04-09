#!/bin/bash
sudo mount / -o remount,rw
sudo loginctl enable-linger pi
mkdir -p .config/epiphany
sudo apt-get update
sudo apt-get install --no-install-recommends spectrwm unclutter epiphany-browser zsh tmux vim libpam-dbus libpam-systemd xinit xserver-xorg x11-xserver-utils xserver-xorg-video-fbturbo matchbox-window-manager
sudo apt-get purge dphys-swapfile
sudo chmod +s /usr/lib/xorg/Xorg /usr/bin/X
systemctl --user enable startx.service
systemctl --user enable restartx.timer
systemctl --user start restartx.timer startx.service
chsh -s /bin/zsh pi
sudo mount / -o remount,ro
sudo reboot
