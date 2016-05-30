#!/bin/sh
# needs to run as root
#(c) Bernhard Tittelbach, xro@realraum.at, 2013..2016
IPATH=~pi/Pictures
TIMEOUT=4
#SHOW_IMAGE_DESC=1
SHOW_IMAGE_DESC=0

# wait until no more changes have occured in directory for $TIMEOUT seconds
while inotifywait -r -t "$TIMEOUT" -q -q -e modify,close,open,attrib,move,create,delete "$IPATH"; do
  sleep 1
done


if [ $SHOW_IMAGE_DESC -eq 1 ]; then

	#overwrite Comment section displayed by fbi with either ImageDescription or Filename
	exiftool -overwrite_original -Comment'<${Filename}' -Comment'<${ImageDescription}' ${IPATH}/*

	#cd so fbi shows filenames without path
	cd ${IPATH}/
	exec fbi -a -t 9 --blend 500 --comments --readahead -T 1 *

else
	# --noverbose disables statusline with text at the bottom
	exec fbi -a -t 9 --blend 500 --readahead --noverbose -T 1 ${IPATH}/*

fi

