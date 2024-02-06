const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5000;

//const mongoose = require('mongoose');
const { Player, File } = require('./modelsMongoose.js');
//mongoose.connect('mongodb+srv://mongo:mongo@cluster1.9yfpvna.mongodb.net/dbproj3?retryWrites=true&w=majority');

// const { MongoClient } = require('mongodb');
// const client = new MongoClient('mongodb+srv://mongo:mongo@cluster1.9yfpvna.mongodb.net/?retryWrites=true&w=majority');
// client.connect();

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '_' + file.originalname)
    }
  })
const upload = multer({ storage: storage })

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); //Použití: http://localhost:5000/uploads/1.png  //app.use(express.static('uploads')); Použití: http://localhost:5000/1.png

//upload.single     tj. upload jednoho souboru
//upload.array      tj. upload více souborů
//nyní asi univerzální, ponechat "upload.array"
//pokud nepošlu žádný soubor, pak "req.files" není undefined, ale prázdné pole, tj. []
//funguje, i pokud na klientovi není nastaveno "multiple"
app.post('/player', upload.array('file'), async(req, res) => {
    //console.log(req.body);    //console.log(req.file);    //console.log(req.files);
    
    console.log(req.body);
    //console.log(JSON.parse('{"name":"John", "age":30, "car":null, "state": true}'));
    // for (prop in req.body) {
    //     console.log(prop, req.body[prop], typeof(req.body[prop]))
    //     if (req.body[prop] == "null") {
    //         delete req.body[prop]
    //     }
    // }

    //Sqlite:
    //const p = await Player.create(req.body);
    // for (let item of req.files) {
    //     const f = await File.create(item);
    //     await f.setPlayer(p);        
    // }
    // res.send(req.obj);

    // //mongoose
    try {
        console.log("try blok začátek");

        const p = await Player.create(req.body);
        for (let item of req.files) {
            const f = await File.create(item);
            //await f.setPlayer(p);   //Toto je vložení vazby v sequelize
            await p.files.push(f._id);
            await p.save();
        }

        console.log("try blok konec");
    } catch(err) {
        console.log("catch blok");
        console.log(err);
    } finally {
        console.log('finally blok')
    }
    console.log('---------------------')

    //mondodb
    // const db = client.db("dbproj3mongodb");
    // const result = await db.collection('players').insertOne(req.body);
    // console.log("result:")
    // console.log(result);




    res.send(req.body);
});

app.get('/player', async(req, res) => {
    //const p = await Player.findAll({ include: { all: true, nested: true } });
    const p = await Player.find().populate('files').exec();
    //console.log(JSON.parse(JSON.stringify(p)));
    res.send(p);
});

app.get('/player/:id', async(req, res) => {
    //const p = await Player.findByPk(req.params.id, { include: { all: true, nested: true } });
    //const p = await Player.findById(req.params.id);   //findById nemá middleware
    const p = await Player.findOne({_id: req.params.id}).populate('files').exec();
    res.send(p);
});

app.put('/player/:id', async(req, res) => {
    //const p = await Player.findByPk(req.params.id);
    //await p.update(req.body);

    //mongoose:
    const filter = {_id: req.params.id};
    const update = req.body;
    console.log(filter);
    console.log(update);
    const p = await Player.findOneAndUpdate(filter, update, {
        new: true
    });
    res.send(p);
});

app.delete('/player/:id', async(req, res) => {
    //const p = await Player.findByPk(req.params.id); //Sequelize
    const p = await Player.findById(req.params.id);
    if (p) {
        //await p.destroy();   //Sequelize     
        await p.deleteOne();    //Mongoose
    }
    res.send(p);
});

//Sequelize
// app.get('/models_update', async(req, res) => {
//     await sync();
//     res.send('schema aktualized');
// });

app.get('/file', async(req, res) => {
    const f = await File.findAll({ include: { all: true, nested: true } });
    res.send(f);
});

app.get('/file/:id', async(req, res) => {
    const f = await File.findByPk(req.params.id);
    res.send(f);
});

app.delete('/file/:id', async(req, res) => {
    const f = await File.findByPk(req.params.id);
    if (f) {
        await f.destroy();        
    }
    res.send(f);
});

app.listen(port, () => console.log(`server listening on port: ${port}`));