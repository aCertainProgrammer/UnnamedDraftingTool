mkdir ./img/champion_icons/centered
mkdir ./img/champion_icons/tiles
mkdir ./img/champion_icons/small

cd ./scripts/
node updatePatch.ts
cd ..

rm -rf ./img/champion_icons/centered
rm -rf ./img/champion_icons/tiles
rm -rf ./img/champion_icons/small

