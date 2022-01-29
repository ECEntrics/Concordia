#!/bin/bash

INTEGER_TO_MAP=$1

echo $(( INTEGER_TO_MAP * 999 / 4095 ))
