# mongo-poc

just playing around and kicking the tires of MongoDB

## Mongo

```shell
export MONGODB_VERSION=6.0-ubi8
docker run --name mongodb -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=testAdmin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo

```
