#! /bin/bash
sshpass -p nvidia ssh nvidia@192.168.2.3 'cd ~/jetson-inference/remoteScripts; ./remoteStopWrap.sh'
