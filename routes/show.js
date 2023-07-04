const router = require('express').Router();
const File = require('../models/file');


router.get('/:uuid', async (req, res) => {
    try {
        // setting up download link point 
        const file = await File.findOne({ uuid: req.params.uuid });
        // Link expired
        if(!file) {
            return res.render('download', { error: 'Link has been expired.'});
        } 
        //sending section to filename to uuid and dowload link 
        return res.render('download', {
             uuid: file.uuid, 
             fileName: file.filename, 
             fileSize: file.size,
             downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}` });
             // http://localhost:3000/files/9a9123f0-6ec8-450d-af20-8ea6257582a1"
    } catch(err) {
        return res.render('download', { error: 'Something went wrong.'});
    }
});


module.exports = router;