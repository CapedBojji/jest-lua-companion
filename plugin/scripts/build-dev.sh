#!/usr/bin/bash
set -e

export NODE_ENV=development

pnpm exec rbxtsc --verbose

rojo build -o dev.rbxl --verbose default.project.json 