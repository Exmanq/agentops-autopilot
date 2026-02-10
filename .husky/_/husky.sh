#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    [ "$HUSKY_DEBUG" = "true" ] && echo "husky: $*"
  }
  readonly husky_skip_init=1
  export husky_skip_init

  debug "reading .huskyrc"
  [ -f ~/.huskyrc ] && . ~/.huskyrc
fi
