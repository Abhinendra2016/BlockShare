const router = require('express').Router();
const multer =require('multer');
const path=require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');
//const { log } = require("console");
//const file = require("../models/file");
//const upload = require("../middleware/upload");

     let storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/'),
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
          cb(null, uniqueName);
        }
      });
      
 let upload = multer({ storage, limit:{ fileSize: 1000000 * 100 }, }).single('myfile'); //100mb
 

router.post("/",(req,res)=> {
//store file
   upload(req,res,async(err) =>{
    //validate request  
    if (!req.file)
   {
      return res.json({ error : 'All fields are required'});
    }
   
    else if (err) {
        return res.status(500).send({ error: err.message });
      }
//store into database
const file = new File({
    filename: req.file.filename,
    uuid: uuidv4(),
    path: req.file.path,
    size: req.file.size,

   });
   const response = await file.save();
   return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
//response ->link
});

});

//through email send file code 
router.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom, expiresIn } = req.body;
  if(!uuid || !emailTo || !emailFrom) {
      return res.status(422).send({ error: 'All fields are required except expiry.'});
  }
  // Get data from db 
  try {
    const file = await File.findOne({ uuid: uuid });
    if(file.sender) {
      return res.status(422).send({ error: 'Email already sent once.'});
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    // send mail
    const sendMail = require('../services/mailService');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'BLOCKShare file sharing',
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/emailTemplate')({
                emailFrom, 
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                size: parseInt(file.size/1000) + ' KB',
                expires: '24 hours'
            })
    }).then(() => {
      return res.json({success: true});
    }).catch(err => {
      return res.status(500).json({error: 'Error in email sending.'});
    });
} catch(err) {
  return res.status(500).send({ error: 'Something went wrong.'});
}

});

module.exports = router;
