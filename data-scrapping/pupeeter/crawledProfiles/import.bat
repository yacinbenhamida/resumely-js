@echo off
for %%f in (*.json) do (
    "mongoimport.exe" --host Resumely-shard-0/resumely-shard-00-00-g5wzc.mongodb.net:27017,resumely-shard-00-01-g5wzc.mongodb.net:27017,resumely-shard-00-02-g5wzc.mongodb.net:27017 --ssl --username ybh --password MongoDBPWD1920 --authenticationDatabase admin --db resumelydb --collection candidates --type json --file %%f
)
pause