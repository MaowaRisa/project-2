import mongoose from 'mongoose';
import config from './app/config';
import app from './app';
import { Server } from 'http';

let server: Server;
// const mongoose = require('mongoose');
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();

process.on('unhandledRejection', ()=>{
  console.log(`🐙 Unhandled rejection is detected, Shutting down...`)
  if(server){
    server.close(()=>{
      process.exit(1)
    })
  }
  process.exit(1)
});

process.on('uncaughtException', ()=>{
  console.log(`🐙 uncaught exception is detected, Shutting down...`)
  process.exit(1)
})

