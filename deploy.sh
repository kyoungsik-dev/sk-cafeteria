#!/bin/bash

echo "########################################"
echo "##### Docker Hub 배포를 시작합니다 #####"
echo "########################################"
echo ""
echo "1. Docker 빌드를 시작합니다."
echo ""
docker build --tag kyoungsikdev/sk-cafeteria:latest .
echo ""
echo "Docker 빌드 완료"
echo ""
echo "2. Docker Hub 푸시를 시작합니다."
echo ""
docker push kyoungsikdev/sk-cafeteria:latest
echo ""
echo "푸시 완료"
echo ""