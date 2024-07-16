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
router.post('/', isLoggedIn, upload.array('image'), async (req, res) => {
    const newTea = new Tea(req.body.tea);
    console.log(req.query.vendor)
    newTea.vendor = req.query.vendor._id;
    newTea.producer = req.query.producer._id;
    newTea.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await newTea.save();
    res.redirect('/tea/' + newTea._id);
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
 const currentYear = new Date().getFullYear();
    res.render('teas/new', {vendor, producer, currentYear});
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

router.put(':id', catchAsync(async (req, res) => {
    const foundTea = await Tea.findById(req.params.id);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    tea.images.push(...imgs);
    await foundTea.save();

}))

    router.delete('/:id', catchAsync(async (req, res) => {
        await Tea.findByIdAndDelete(req.params.id);
        res.redirect('/tea');
    }))

module.exports = router;