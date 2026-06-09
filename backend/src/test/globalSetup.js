import { MongoMemoryServer } from 'mongodb-memory-server'

export default async function globalSetup() {
  //Create a memory server for MongoDB
  const instance = await MongoMemoryServer.create({
    //Same version we installed for our docker
    binary: {
      version: '7.0.14',
    },
  })
  //Store in global variable
  global.__MONGOINSTANCE = instance
  //url to connect to our test intance
  process.env.DATABASE_URL = instance.getUri()
}
