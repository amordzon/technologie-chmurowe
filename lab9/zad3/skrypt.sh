#!/bin/bash

docker buildx create --name mybuilderr
docker buildx use mybuilderr
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7,windows/amd64 -t ola10417/stepik:latest --push .
docker run ola10417/stepik:latest
