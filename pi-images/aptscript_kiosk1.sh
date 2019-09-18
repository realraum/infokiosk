DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get purge --yes dphys-swapfile avahi-daemon
apt autoremove
apt-get upgrade --yes
apt-get install --yes --no-install-recommends zsh tmux vim libpam-dbus libpam-systemd rsync inotify-tools pypy fbi samba inotify-tools libimage-exiftool-perl mosquitto mosquitto-clients bluetooth bluez-obexd bluez-tools libbluetooth-dev
/bin/loginctl enable-linger pi
apt-get purge rsyslog
