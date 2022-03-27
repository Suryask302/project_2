
const validator = require("email-validator");
const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false 
    return true;
}


const isValidBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

const isValidName = function (value) {
    if(!(value === value.toLowerCase())) {
        return false
    }
    return true
}

const isValidMobile = function (value) {
    if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value.trim()))) {
        return false
    }
    return true
}


const isValidEmail = function (value) {
    if (!(validator.validate(value))) {
        return false
    }
    return true
}

const isValidLink = function(value) {
    if (!(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(value.trim()))) {
        return false
    }
    return true
}

const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}


module.exports.isValid = isValid
module.exports.isValidBody = isValidBody
module.exports.isValidName = isValidName
module.exports.isValidMobile = isValidMobile
module.exports.isValidEmail = isValidEmail
module.exports.isValidLink = isValidLink
module.exports.isValidobjectId = isValidobjectId
