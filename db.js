const {Client} =require('pg')
const client =new Client('postgresql://neondb_owner:Bvk0KX3IxLlT@ep-young-violet-a5yinpzw-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require')
client.connect()
client.query(`
    create table if not exists schools (
    id serial primary key,
    name varchar(255) not null,
    address varchar(255) not null,
    latitude float not null,
    longitude float not null
)`
,(err,res)=>{
    if(err) throw err
    console.log(res.rows)
})

module.exports = { client }