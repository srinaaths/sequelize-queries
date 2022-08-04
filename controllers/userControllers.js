
const verifyJWT = async (req, reply) => {
    const token = req.headers['x-access-token']
    if (!token) {
        reply('we need a token')
    }
    else {
        jwt.verify(token, 'jwtsecret', (err, decoded) => {
            if (err) {
                console.log(err.message);
                reply({
                    auth: false,
                    message: 'u failed to authenticate'
                })
            } else 
            {
                req.userId = decoded.id;
                reply({
                    userId: decoded.id,
                    isAuthenticated: true,
                    message: 'succesfully authenticated'
                })
            }
        })
    }
}

const isUserAuthenticated = async (req, reply) => {
    logger.info('isUserAuthenticated called')
    verifyJWT(req, reply);
}

const loginUser = async (req, reply) => {
    const userData = req.payload;
    logger.info('loginUser called')
    logger.info(userData.name)
    logger.info(userData.password)
    try {
        const result = await user.findOne(
            {
                where: {
                    name: userData.name
                },
            }
        )
        logger.info(result)
        if (result === null) {
            logger.info('user not found');
            reply({
                auth: false,
                message: 'no user exists'
            })
        }
        else {
            logger.info('user Found');
            const passwordInDb = result.password;
            console.log('pass in db is ' + passwordInDb);
            const passwordMatch = await bcrypt.compare(userData.password, passwordInDb)
            logger.info(passwordMatch)
            if (passwordMatch) {
                const id = result.id;
                const token = jwt.sign({ id }, 'jwtsecret', {
                    expiresIn: 3000
                })
                logger.info('passwords match successful login')
                reply({
                    auth: true,
                    token: token,
                    result: result
                })
            }
            else {
                reply({
                    auth: false,
                    message: 'wrong user password'
                })
            }
        }
    } catch (error) {
        logger.error(error.message)
    }
}

const addRating = async (req, reply) => {
    try {
        logger.info('addRating called')
        const findExisting = await rating.destroy({
            where: {
                movieId: req.payload.movieId,
                userId: req.payload.userId,
            }
        }
        )
        const data = await rating.create(req.payload);
        logger.info('addRating success')
        reply('rating added')
    } catch (error) {
        console.log(error);
        logger.error('addRating error')
        reply(error.message);
    }
}
