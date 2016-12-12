#!/bin/bash
sudo mount / -o remount,rw
sudo loginctl enable-linger pi
sudo apt-get update
sudo apt-get install --no-install-recommends spectrwm unclutter epiphany-browser zsh tmux vim libpam-dbus libpam-systemd
systemctl --user enable startx.service
systemctl --user enable restartx.timer
systemctl --user start restartx.timer startx.service
chsh -s /bin/zsh pi
sudo mount / -o remount,ro

