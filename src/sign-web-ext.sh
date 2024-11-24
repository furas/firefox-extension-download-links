#!/bin/bash

# author: Bartlomiej "furas" Burek (https://blog.furas.pl)
# date: 2024.11.21

cd firefox-extension

web-ext sign \
  --api-key="${FIREFOX_KEY}" \
  --api-secret="${FIREFOX_SECRET}" \
  --channel 'unlisted' \
  --verbose
