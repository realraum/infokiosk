#!/bin/bash
sudo loginctl enable-linger pi
systemd --user enable startx.service
systemd --user enable restartx.timer
sudo apt-get install spectrwm unclutter epiphany-browser zsh
systemctl --user start restartx.timer startx.service
chsh -s /bin/zsh pi

