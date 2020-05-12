const express  = require('express');
const cors = require('cors')
const app = express();
const monk = require('monk')
const Filter = require('bad-words')
const rateLimit = require("express-rate-limit");

const db = monk(process.env.MONGO_URI || 'localhost/meower')
const mews = db.get('mews')

const filter = new Filter()



app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
    res.json({
        message: 'Meower! 🐱🐈 from cats'
     })
})

app.get('/mews',(req,res) => {
    mews
        .find()
        .then(mews => {
            res.json(mews);
        })
})

function isValidmew(mew){
    return mew.name && mew.name.toString().trim() !== '' && 
        mew.content && mew.content.toString().trim();  
} 

app.use(rateLimit({
    windowMs: 30 *1000,
    max: 1
}));

app.post('/mews', (req,res) => {
    if(isValidmew(req.body)){
        const mew = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created : new Date()
        }
        mews
            .insert(mew)
            .then(createdMew => {
                res.json(createdMew)
            }) 
    }
    else{
        res.status(422)
        res.json({
            message: 'Hey name and contend are required!'
        })
    }
})

app.listen(5000,() => {
    console.log('Listong on http://localhost:5000');
})