const mongoose = require('mongoose')
const uri = 'mongodb+srv://nanaaisha2106db:aisha.ad4ji@nanasscluster.5zj1sez.mongodb.net/plaza-os?appName=NanassCluster'

async function checkAdmins() {
  await mongoose.connect(uri)
  const users = mongoose.connection.collection('users')
  const admins = await users.find({ role: 'admin' }).toArray()
  console.log('Found admins:', admins.map(a => ({ email: a.email })))
  process.exit(0)
}

checkAdmins()
