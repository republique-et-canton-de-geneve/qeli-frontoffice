#!/bin/sh

cd ***REMOVED***/
ln -f -s ../livraison/`ls -t livraison/ | tail -n1` webapps/socialqeli_pub.war
sh ./etc/tomcat.bash restart
