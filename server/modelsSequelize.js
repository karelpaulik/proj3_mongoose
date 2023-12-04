const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
    //logging: false
});

async function sync() {
    await sequelize.sync({ alter: true });
};

const Player = sequelize.define('player', {
    fName: DataTypes.STRING,
    lName: DataTypes.STRING,
    age: DataTypes.INTEGER,
    richText: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    city: DataTypes.JSON,   //JSON je způsob, jak uložit array
    prefColor: DataTypes.STRING,
    prefShape: DataTypes.STRING
    // destination: DataTypes.STRING,
    // filename: DataTypes.STRING,
    // filenames: DataTypes.JSON,
    // path: DataTypes.STRING
});

const File = sequelize.define('file', {
    fieldname: DataTypes.STRING,
    originalname: DataTypes.STRING,
    encoding: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    destination: DataTypes.STRING,
    filename: DataTypes.STRING,
    path: DataTypes.STRING,
    size: DataTypes.BIGINT
}, {
    hooks: {
        beforeDestroy: (file, options) => {
            //console.log('Hook: file - beforeDestroy');
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
        }
    }
});

File.belongsTo(Player, {
    //onDelete: 'CASCADE',
    //hooks: true
    //foreignKeyConstraint : true,
});
Player.hasMany(File, { 
    onDelete: 'CASCADE', 
    hooks: true,
});

// File.addHook('beforeDestroy', (file, options) => {
//     console.log('Hook: file - beforeDestroy');
//     console.log(file.path);
//     //console.log(options);
// });

// (async () => {
//     await sequelize.sync();

//     const p = await Player.create({
//         fName: 'John',
//         lName: 'Doe',
//         age: '20'
//     });
// })();

module.exports = { Player, File, sync }