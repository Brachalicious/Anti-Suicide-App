#!/usr/bin/env python3
import os
import subprocess
import sys

if __name__ == "__main__":
    os.chdir('/home/runner/workspace')
    print("Starting Mental Health Support App server...")
    os.execvp("npx", ["npx", "tsx", "server/index.ts"])
