const express = require('express');
const router = express.Router();
const Tea = require('../models/tea');
const Vendor = require('../models/vendor')
const Producer = require('../models/producer')
const catchAsync = require('../utilities/catchAsync');
const DataTable = require('datatables.net-dt');
const {isLoggedIn, isAuthor, validateTea} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const vendor = require('../models/vendor');
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
    const newTea = new Tea(req.body.tea);
    newTea.vendor = req.query.vendor._id;
    newTea.producer = req.query.producer._id;
    await newTea.save();
    res.redirect('/tea');
})
router.get('/newVendor', isLoggedIn, (req, res) => {
    res.render('teas/newVendor')
})
router.post('/newVendor', async(req, res) => {
    let vendor = await Vendor.findOne({ name: req.body.vendor.name});
    let producer = await Producer.findOne({ name: req.body.producer.name});
if (!vendor) {
   const newVendor = new Vendor({ name: req.body.vendor.name});
   vendor = await newVendor.save();
}
if (!producer) {
    const newProducer = new Producer({name: req.body.producer.name});
    producer = await newProducer.save();
 }
    res.render('teas/new', {vendor, producer});
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