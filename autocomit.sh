#/bin/bash

inotifywait -q -m  -e CLOSE_WRITE --format="git pull origin master && git add . && git commit -m 'auto commit' %w && git push origin master" README.tex.md | bash
