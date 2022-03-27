
const collegeModel = require('../models/collegeModel');
const internModel = require('../models/internModel');
const validator = require('../validator/validation');

const createCollege = async function (req, res) {
    try {
        const body = req.body;
        const { name, fullName, logoLink, isDeleted } = body;

        //Validate body
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "College body should not be empty" });
        }

        //Validate name
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, msg: "College name is required" });
        }

        // Validation of name in lowercase
        if(!validator.isValidName(name)) {
            return res.status(400).send({ status: false, msg: "name should be lower case"})
        }

        // Validate fullname of college
        if (!validator.isValid(fullName)) {
            return res.status(400).send({ status: false, msg: "Full Name of college is required" });
        }

         //Validate the logo link
         if (!validator.isValid(logoLink)) {
            return res.status(400).send({ status: false, msg: "Logo link is required" });
        }

        // Validate the Link
        if(!validator.isValidLink(logoLink)) {
            return res.status(400).send({status: false, msg: "Valid Logo link is required" })
        }


        // name must be a single word
        
        // const collegename = name.split(" ");
        // const word = collegename.length
        // if (word > 1) {
        if(name.split(" ").length > 1) {
            return res.status(400).send({ status: false, msg: "please provide the Valid Abbreviation" });
        }
        

        // Cheking duplicate Entry Of College 
        let duplicateEntries = await collegeModel.find();
        let duplicateLength = duplicateEntries.length

        if (duplicateLength != 0) {
            // Checking duplicate fullName
            const duplicateCollegeName = await collegeModel.findOne({ fullName: fullName });
            if (duplicateCollegeName) {
                return res.status(409).send({status: false, msg: "College Full Name already exists" });
            }

            const duplicateAbbr = await collegeModel.findOne({ name: name });
            if (duplicateAbbr) {
                return res.status(409).send({status: false, msg: "College Name already exists" });
            }


            // Duplicate Logo Link
            const duplicateLogolink = await collegeModel.findOne({ logoLink: logoLink })
            if (duplicateLogolink) {
                return res.status(409).send({ status: false, msg: 'The logo link which you have entered belong to some other college' })
            }
        }

        // isDeleted should be false
        if (isDeleted === true) {
            return res.status(400).send({ status: false, msg: "New entries can't be deleted" });
        }

        // Finally the registration of college is succesfull
        const collegeInfo = await collegeModel.create(body);
        return res.status(201).send({ status: true, data: collegeInfo });
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}




const getCollegeDetails = async (req ,res) => {
    try{
        const queryParams = req.query
        const {collegeName} = req.query

        // Validate body
        if(!validator.isValidBody(queryParams)) {
        return res.status(400).send({ status : false , message : "Invalid Input Parameters" })
        }

        if(Object.keys(queryParams).length > 1) {
            return res.status(400).send({ status : false, message : "Invalid Input" })
        }

        if(!validator.isValidName(collegeName)) {
            return res.status(400).send({ status : false , message : "Invalid College Abbrivation" })
        }

        if(!collegeName) {
            return res.status(400).send({ status : false , message : "collegeName Is Required" })
        }

        // collegeName must be a single word
        if(collegeName.split(" ").length > 1) {
            return res.status(400).send({ status : false, message : "please provide The Valid Abbreviation" })
        }

        // if name is invalid
        const collegeNames = await collegeModel.findOne({ name : collegeName })
        if(!collegeNames) {
            return res.status(404).send({ status : false , message : "College Not Found, Please Check College Name" })
        }

        const collegeId = collegeNames._id

        const InternsInCollege = await internModel.find({ collegeId : collegeId }).select({ _id : 1, email: 1, name:1, mobile:1 })
        
        const { name, fullName, logoLink } = collegeNames

        // Final list of College details with students name who applied for internship

        const finalData = {

            name: name,
            fullName : fullName,
            logoLink : logoLink,
            interns : InternsInCollege.length ? InternsInCollege : {message: "No one applied for internship in this college"}
            
        }

        return res.status(200).send({ status : true , message: "College Details" , Data : finalData })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}



module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails