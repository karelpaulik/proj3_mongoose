const { Query } = require("mongoose");
const mongoose = require("mongoose");
const fs = require('fs');

mongoose.connect('mongodb+srv://mongo:mongo@cluster1.9yfpvna.mongodb.net/dbproj3?retryWrites=true&w=majority');

const playerSchema = new mongoose.Schema({
    fName: String,
    lName: {
        type: String,
        // required: true,
        // default: ''
        //když zadám "required: true", měl bych zadat i default pro případ, když by ho někdo nezadal.
        //Když zadáno "required + default", pak pozor:
        //1. Pokud klient atirbut neposílá, nastaví se default
        //2. Pokud klient atribut pošle s hotnotou "null", tak vyskočí chyba
    },
    age: {
        type: Number,
        // set: (v) => {   //když definuji seter, měl by setter končit: return ...
        //     if (v == 'null') {
        //         v=0;
        //     }
        //     return Number(v);
        // }
    },
    richText: String,
    isActive: Boolean, //{type: Boolean, required: true, default: false},
    city: [String],
    prefColor: String,
    prefShape: String,
    files: [{type: mongoose.Schema.Types.ObjectId, ref: 'File'}]
}, {});
//playerSchema.set('validateBeforeSave', false);  //toto vypne validaci

playerSchema.pre('validate', function(next) {
    console.log('playerSchema.pre');
    // console.log(this);
    // console.log(typeof(this.age));
    // console.log(this.age);
    // if (this.age ==0) {
    //     this.age = null;
    // }
    console.log(this);
    console.log(this.age);
    // if (!isNaN(this.age)) {
    //     this.age=Number(this.age)
    // }
    //console.log(this);
    next();   
});

//findById  - nemá middleware
//deleteOne                     //Zde funguje: {document: true, query: false}
//findOne
//playerSchema.pre('deleteOne', {document: true, query: false}, function(next) {        //OK
//playerSchema.pre('findOne', {document: true, query: false}, function(next) {            //NOK
//playerSchema.post('findOne', function(next) {
playerSchema.pre('findOne', async function(next) {          //fineOne: this má referenci na Query, ne na dokument. Níže ukázka, jak dostat ref. na dokument.
    // console.log('playerSchema.pre');
    // console.log(typeof this);
    // console.log(this instanceof Query);
    // console.log(this.constructor.name);     //Čeho to je instance
    // const p = await this.model.find(this.getQuery());       //Nemůžu např. uvnitř "playerSchema.pre('findOne')" použít "findOne", protože pak vznikně nekonečná smyčka!!!!
    // console.log(p);
    // next();   
});

playerSchema.pre('deleteOne', {document: true, query: false}, async function(next) {
    console.log('deleteOne------------------');
    console.log(this);

    //TOTO FUNGUJE, ALE NA CELKEM DOST ŘÁDKŮ
    for (let file of this.files) {
        //1. možnost
        let f = await File.findById(file);
        await f.deleteOne();                  //Buď     //middleware: document middleware
        // await File.deleteOne({ _id: file });    //Nebo (funguje obojí) //Pozor, middleware: query middleware

        //2. možnost
        //await File.findByIdAndDelete(file);         //Taky funguje

    }

    //3. možnost - FUNGUJE, A JE JEN NA JEDNOM ŘÁDKU
    //await File.deleteMany({ _id: this.files});

    //KTEROU METODU VYBRAT:
    //První metoda (Document middleware) má velkou výhodu i když je zde na více řádků:
    //Totiž "Document middleware" vrací objekt, tj. v tomto případě document "file". Tzn. Zde zde mám i atribut "path", který potřebuji pro smazání souboru.
    //Druhá a třetí metoda "Query middleware" vrací query. Tudíž přes "this.getFilter()" se dostanu na "id" jednotlivých souborů, ale ne na "path". "path" je nutno v dalším kroku vyhledata.

    next();
});

const Player = mongoose.model('Player', playerSchema)

//-----------------------------------------------------------------

const fileSchema = new mongoose.Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: String
}, {});

//Tato metoda soubory nemaže.
//Toto je zde pro ukázku, jak se pracuje s "this" uvnitř "deleteMany". Jinak než uvnitř "deleteOne".
fileSchema.pre('deleteMany', {document: false, query: true}, async function(next) {
    console.log('fileSchema - deleteMany------------------');
    console.log('getFilter---------------------')
    console.log(this.getFilter());

    for (let file of this.getFilter()._id) {
        console.log(file)
    }

    next();
});

//Tato metoda již funguje, maže soubory
fileSchema.pre('deleteOne', {document: true, query: false}, async function(next) {
    console.log('fileSchema - deleteOne------------------');
    //console.log(this);
    const file=this;

    if (file.path) {
        fs.unlink(file.path, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Deleted: ${file.path}`);
            }
        });
    } else {
        console.log('Path to the file does not exist')
    }

    next();
});

const File = mongoose.model('File', fileSchema)

module.exports = { Player, File }