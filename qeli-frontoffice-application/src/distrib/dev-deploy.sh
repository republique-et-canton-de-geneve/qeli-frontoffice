#!/bin/sh

cd %CATALINA_HOME%
ln -f -s ../livraison/`ls -rt livraison/ | tail -n1` webapps/socialqeli_pub.war
sh ./etc/tomcat.bash restart
