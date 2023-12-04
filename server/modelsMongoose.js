//const { Sequelize, DataTypes } = require('sequelize');
const mongoose = require("mongoose");
//const fs = require('fs');

// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'db.sqlite',
//     //logging: false
// });

// async function sync() {
//     await sequelize.sync({ alter: true });
// };

//----------------------------------------------------------------
// const Player = sequelize.define('player', {
//     fName: DataTypes.STRING,
//     lName: DataTypes.STRING,
//     age: DataTypes.INTEGER,
//     richText: DataTypes.STRING,
//     isActive: DataTypes.BOOLEAN,
//     city: DataTypes.JSON,   //JSON je způsob, jak uložit array
//     prefColor: DataTypes.STRING,
//     prefShape: DataTypes.STRING
// });

const playerSchema = new mongoose.Schema({
    fName: String,
    lName: {
        //když zadám "required: true", měl bych zadat i default pro případ, když by ho někdo nezadal.
        //Když zadáno "required + default", pak pozor:
        //1. Pokud klient atirbut neposílá, zastaví se default
        //2. Pokud klient atribut pošle s hotnotou "null", tak vyskočí chyba
        type: String,
        required: true,
        default: ''
    },
    age: {
        type: Number,
        required: true,  
        default: 0,
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
    prefShape: String
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
    console.log(this);
    next();   
});

const Player = mongoose.model('Player', playerSchema)

module.exports = { Player }
//-----------------------------------------------------------------

// const File = sequelize.define('file', {
//     fieldname: DataTypes.STRING,
//     originalname: DataTypes.STRING,
//     encoding: DataTypes.STRING,
//     mimetype: DataTypes.STRING,
//     destination: DataTypes.STRING,
//     filename: DataTypes.STRING,
//     path: DataTypes.STRING,
//     size: DataTypes.BIGINT
// }, {
//     hooks: {
//         beforeDestroy: (file, options) => {
//             //console.log('Hook: file - beforeDestroy');
//             if (file.path) {
//                 fs.unlink(file.path, function (err) {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         console.log(`Deleted: ${file.path}`);
//                     }
//                 });
//             } else {
//                 console.log('Path to the file does not exist')
//             }
//         }
//     }
// });

// File.belongsTo(Player, {
//     //onDelete: 'CASCADE',
//     //hooks: true
//     //foreignKeyConstraint : true,
// });
// Player.hasMany(File, { 
//     onDelete: 'CASCADE', 
//     hooks: true,
// });

// module.exports = { Player, File, sync }