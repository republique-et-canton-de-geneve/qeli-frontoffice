#!/bin/sh

QELI_PID_FILE=./qeli.pid

if test -f "$QELI_PID_FILE"; then
  kill `cat ${QELI_PID_FILE}`
  rm ${QELI_PID_FILE}
fi

java -jar qeli-frontoffice-application.war --spring.profiles.active=development,standalone &
echo $! > ${QELI_PID_FILE}
