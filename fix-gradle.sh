#!/bin/bash

echo "👉 Borrando caches de Gradle..."
rm -rf ~/.gradle/caches
rm -rf ~/.gradle/wrapper

echo "👉 Borrando caches de Metro y Watchman..."
watchman watch-del-all
rm -rf $TMPDIR/metro-*

echo "👉 Borrando node_modules y reinstalando..."
rm -rf node_modules
sudo npm cache clean --force
sudo npm install

echo "👉 Limpiando Android..."
cd android
./gradlew clean

echo "✅ Todo limpio. Ahora podés volver a correr el build."


