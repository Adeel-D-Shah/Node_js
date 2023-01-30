const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const dburi = "mongodb+srv://adl-2:123456654321@cluster0.dcpowex.mongodb.net/test";
const client = new MongoClient(dburi)
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Server listening on port ${port}!`))



//endpoits (APIs)
app.post('/login',async (req, res) => {
    const { username, password } = req.body;
     const dbrespons = await Authenticate (username,password);
     res.send(dbrespons);


  });

app.post('/new_note',async(req,res)=>{

    const {user,note} = req.body;
    const response =await  Post_New_Note(user,note);
    res.send(response);
    

})

app.get('/my_notes',async (req,res) =>{

    const {user} = req.body;
    const response =    await  My_Notes(user);
    res.send(response);
})

//functions
async function Authenticate(name,pwd){
   
    await client.connect()
    const db =  client.db('Playground');
    const Users = db.collection('Users');
    
    const findResult = await Users.find({name:name,pwd:pwd},{projection:{_id:0}}).toArray();
    if(findResult.length==0)    {return {login:false}}    else{ return {login:true}}
    
}
async function Post_New_Note(user,note){

    await client.connect()
    const db =  client.db('Playground');
    const notes = db.collection('Notes');

    const data = {user:user,note:note}
    await notes.insertOne(data)
    client.close();
    return true;



}
async function My_Notes(user){

    await client.connect();
    const DB = client.db('Playground');
    const collection = DB.collection('Notes');

    const list = await collection.find({user:user},).toArray();
    client.close();
    return list

}

