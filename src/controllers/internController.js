const collegeModel = require('../models/collegeModel');
const internModel = require('../models/internModel');
const validator = require('../validator/validation');

const createIntern = async function (req, res) {
    try {
        const body = req.body;
        const { name, mobile, email, collegeName, isDeleted } = body; 

        // Validate body
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "Intern body should not be empty" });
        }

        // Validate name
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, msg: "Intern name is required" });
        }

        // Validate mobile
        if (!validator.isValid(mobile)) {
            return res.status(400).send({ status: false, msg: "Mobile number is required" });
        }

        // Validation mobile number
        if (!validator.isValidMobile(mobile)) {
            return res.status(400).send({ status: false, msg: 'Valid Mobile number is required' })
        }

        // Validate email
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, msg: "email is required" });;
        }

        // Validation of Email
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "Valid email is required" });
        }

        // validate college Name
        if(!collegeName) {
            return res.status(400).send({ status: false, msg: "CollegeName is required" });
        }

        
        // if(!validator.isValidobjectId(collegeId)) {
        //     return res.status(400).send({ status: false, msg: `${collegeId} is Not A Valid College ID` });
        // }

        // Checking duplicate entry of intern
        let duplicateEntries = await internModel.find();
        let duplicateLength = duplicateEntries.length

        if (duplicateLength != 0) {
            
            //Cheking duplicate email
            const IsEmailUsed = await internModel.find({ email: email });
            if (IsEmailUsed.length !== 0) {
                return res.status(409).send({ status: false, msg: "email already exists" });
            }
            
            // Checking duplicate mobile    
            const duplicateMobile = await internModel.findOne({ mobile: mobile })
            if (duplicateMobile) {
                return res.status(409).send({ status: false, msg: "Mobile number already exists" });
            }
        }

        // isDeleted should be false       
        if (isDeleted === true) {
            return res.status(400).send({ status: false, msg: "New entries can't be deleted" });
        }
        
        let collegeData = await collegeModel.findOne( { name : collegeName } )
        if (!collegeData) {
            return res.status(404).send({ status: false, msg: "No College found With This Name , Check Name And Try Again" })
        }

        const collegeId = collegeData._id

        // Finally the registration of intern is successful
        let data = { name, mobile, email, collegeId, isDeleted }
        const internData = await internModel.create(data);

       return res.status(201).send({ status: true, data: internData });
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


module.exports.createIntern = createIntern;
