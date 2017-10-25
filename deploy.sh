#!/bin/bash

ng build --base-href /zang/app/
scp dist/* max:/cav/tomcat7/webapps/zang/app/
#scp signin.css index.jsp cav@leyntst:/cav/tomcat8/webapps/svn/
