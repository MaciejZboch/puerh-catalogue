const express = require('express');
const router = express.Router();
const Tea = require('../models/tea');
const Vendor = require('../models/vendor')
const catchAsync = require('../utilities/catchAsync');
const DataTable = require('datatables.net-dt');
const {isLoggedIn, isAuthor, validateTea} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage});


router.get('/', (req, res) => {
    res.render('teas/index')
})
router.get('/browse', (req, res) => {
    res.render('teas/browse', {Tea, DataTable})

})


router.get('/new', isLoggedIn, (req, res) => {
    res.render('teas/new')
})
router.post('/', isLoggedIn, upload.single('image'), async (req, res) => {
    const newTea = new Tea(req.body.tea)
    await newTea.save()
    res.redirect('/tea')
})
router.get('/newVendor', isLoggedIn, (req, res) => {
    res.render('teas/newVendor')
})
router.post('/newVendor', async(req, res) => {
const namedVendor = await Vendor.find({ name: req.body.name});
if(!namedVendor) {
   const newVendor = new Vendor(req.body.name);
   newVendor.save();
const namedVendor = newVendor;
}
    res.render('teas/new', {newVendor});
})
router.get('/:id', catchAsync(async (req, res) => {
    const tea = await Tea.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('producer').populate('vendor');
    if (!tea) {
        req.flash('error', 'Cannot find that tea!')
        return res.redirect('/')}
res.render('teas/show', {tea})
    }))
module.exports = router;