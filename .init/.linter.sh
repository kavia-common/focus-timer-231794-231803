#!/bin/bash
cd /home/kavia/workspace/code-generation/focus-timer-231794-231803/pomodoro_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

