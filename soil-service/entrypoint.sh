#!/bin/bash
set -e

rm -f /code/tmp/pids/server.pid

exec "$@"