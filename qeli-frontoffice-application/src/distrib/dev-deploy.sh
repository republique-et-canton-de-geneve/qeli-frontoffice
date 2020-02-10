#!/bin/sh

cd ***REMOVED***/
ln -f -s ./livraison`ls -rt livraison/ | tail -n1` webapps/socialqeli_pub
sh ./etc/tomcat.bash restart
