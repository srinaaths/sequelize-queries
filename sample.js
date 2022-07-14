const {nameValidator, idValidator} = require("./validation.js")

// const {error, value} = nameValidator.validate({name: "dlskfjl()k"})

// if(error)
//     console.log(error);
// else
//     console.log(value);

const {error, value} = idValidator.validate({id: "34fsad2"})
if(error)
console.log(error);
else 
console.log(value);