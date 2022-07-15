const Sequelize = require('sequelize')
const { Op } = require('sequelize')

const sequelize = new Sequelize('seq_db2', 'srinaaths', '', {
    dialect: 'postgres',
    define: {
        timestamps: false,
        freezeTableName: true
    }
})

const movie = sequelize.define('movie', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
}, {
    hooks: {
        beforeUpdate: function() {
            console.log('before update');
        },
        afterUpdate: function () {
            console.log('after update');
        }
    }
})

const director = sequelize.define('director', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
})

const actor = sequelize.define('actor', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false

    }
}, {
    freezeTableName: true,
    timestamps: false
})

const genre = sequelize.define('genre', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false

    }
})

const movie_actor = sequelize.define('movie_actor', {
    role: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
})

const movie_genre = sequelize.define('movie_genre', {})

const rating = sequelize.define('rating', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rating: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false
    },
    review: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
})

const user = sequelize.define('user', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
})

const init = () => {
    director.hasMany(movie)
    movie.belongsTo(director)

    movie.belongsToMany(actor, { through: 'movie_actor' });
    actor.belongsToMany(movie, { through: 'movie_actor' });

    movie.belongsToMany(genre, { through: 'movie_genre' })
    genre.belongsToMany(movie, { through: 'movie_genre' })

    movie.hasMany(rating);
    rating.belongsTo(movie)

    user.hasMany(rating);
    rating.belongsTo(user);

}

init();

sequelize.sync({ alter: true })
    .then(() => {
        console.log('syncing');
    })
    .catch(err => console.log(err))

module.exports = {movie, user, actor, director, movie_actor, movie_genre, rating, genre, sequelize}