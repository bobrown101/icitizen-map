Pre-requisites:
Must have Mongodb installed -> https://www.mongodb.org/downloads#production
Must have node installed -> https://nodejs.org/en/download/

To Run:
- In one terminal window run: mkdir ~/.mongo_data/icitizen-map && mongod --dbpath ~/.mongo_data/icitizen-map
- In the other do the following:
    - cd ~/Developer
    - git clone git@github.com:bobrown101/icitizen-map.git
    - cd ./icitizen-map
    - npm install
    - gulp