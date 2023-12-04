const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5000;

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
  
const { Player, File, sync } = require('./models.js');

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); //Použití: http://localhost:5000/uploads/1.png  //app.use(express.static('uploads')); Použití: http://localhost:5000/1.png

//upload.single     tj. upload jednoho souboru
//upload.array      tj. upload více souborů
app.post('/player', upload.array('file'), async(req, res) => {
    console.log(req.body);    
    console.log(req.file);    
    console.log(req.files);
    if (!(req.file || req.files)) { //Jestliže není ani req.file, ani req.files
        console.log('ani req.file ani req.files');
        const p = await Player.create(req.body);
    }
    else if (req.file) {
        console.log('req.file');
        //const obj = Object.assign(req.body, req.file);  //Nebo: const obj = {...req.body, ...req.file};
        //const p = await Player.create(obj);
        const p = await Player.create(req.body);
        const f = await File.create(req.file);
        await f.setPlayer(p);
    }
    else if (req.files) {
        console.log('req.files');
        console.log(req.files);
        // const files = [];
        // req.files.forEach((val, ind, arr) => {
        //     files.push(val.filename);
        // });
        // const objFiles = { filenames: files };
        // const obj = Object.assign(req.body, objFiles);
        // const p = await Player.create(obj);

        const p = await Player.create(req.body);
        req.files.forEach(async(item, ind, arr) => {
            const f = await File.create(item);
            await f.setPlayer(p);
        });

    }
    res.send(req.obj);
});

app.get('/player', async(req, res) => {
    const p = await Player.findAll({ include: { all: true, nested: true } });
    //console.log(JSON.parse(JSON.stringify(p)));
    res.send(p);
});

app.get('/file', async(req, res) => {
    const f = await File.findAll({ raw: true, include: { all: true, nested: true } });
    res.send(f);
});

app.get('/player/:id', async(req, res) => {
    const p = await Player.findByPk(req.params.id);
    res.send(p);
});

app.put('/player/:id', async(req, res) => {
    const p = await Player.findByPk(req.params.id);
    await p.update(req.body);
    res.send(p);
});

app.delete('/player/:id', async(req, res) => {
    const p = await Player.findByPk(req.params.id);
    await p.destroy();
    res.send(p);
});


app.get('/models_update', async(req, res) => {
    await sync();
    res.send('schema aktualized');
});

app.listen(port, () => console.log(`server listening on port: ${port}`));