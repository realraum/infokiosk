DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get purge --yes dphys-swapfile avahi-daemon
apt autoremove
apt-get upgrade --yes
apt-get install --yes --no-install-recommends xserver-xorg accountsservice xserver-xorg-video-fbturbo xserver-xorg-input-evdev xinput-calibrator matchbox-keyboard xinput xinit spectrwm x11-xserver-utils unclutter epiphany-browser zsh tmux vim libpam-dbus libpam-systemd rsync matchbox-window-manager rpi-chromium-mods
sudo chmod +s /usr/lib/xorg/Xorg /usr/bin/X
/bin/systemctl enable ssh.service getty@ttyGS0.service
/bin/loginctl enable-linger pi

