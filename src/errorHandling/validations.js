const moment = require('moment')
const AppError = require('./AppError')

const validatePlayerInput = (first_name, last_name, nationality, date_of_birth) => {
    if(!first_name) throw new AppError('first name required', 400)
    if(!last_name) throw new AppError('last name required', 400)
    if(!nationality) throw new AppError('nationality required', 400)
    if(!date_of_birth) throw new AppError('date of birth required', 400)
    if(parseInt(moment(new Date(date_of_birth), "YYYYMMDD").fromNow()) < 16) throw new AppError('must be over 16', 400)
}

module.exports = { validatePlayerInput };
