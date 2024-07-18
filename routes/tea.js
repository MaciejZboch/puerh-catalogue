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
const currentYear = new Date().getFullYear();
const { cloudinary } = require('../cloudinary')


router.get('/', (req, res) => {
    res.render('teas/index')
})
router.get('/browse', (req, res) => {
    res.render('teas/browse', {Tea, DataTable})

})


router.get('/new', isLoggedIn, (req, res) => {

    
    res.render('teas/new', {currentYear})
})
router.post('/', isLoggedIn, upload.array('image'), async (req, res) => {
    const newTea = new Tea(req.body.tea);
    newTea.vendor = await Vendor.findOne({ name: req.body.vendor.name});
    newTea.producer = await Producer.findOne({ name: req.body.producer.name});
 console.log(req.body.tea);
 newTea.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
 await newTea.save();
 res.redirect('/tea/' + newTea._id);
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
        return res.redirect('/tea')}
res.render('teas/show', {tea})
    }))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const t = await Tea.findById(req.params.id);
    if (!t) {
        req.flash('error', 'Cannot find that tea!')
        return res.redirect('/tea')}
    res.render('teas/edit', {t, currentYear})
}))

router.put('/:id', upload.array('image'), catchAsync(async (req, res) => {
    console.log(req.body.tea)
    const foundTea = await Tea.findByIdAndUpdate(req.params.id, {...req.body.tea});
    if (req.files) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await foundTea.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        foundTea.images.push(...imgs)}
        await foundTea.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Succesfully updated!');
    res.redirect(`/tea/${foundTea._id}`);
}))

    router.delete('/:id', catchAsync(async (req, res) => {
        await Tea.findByIdAndDelete(req.params.id);
        res.redirect('/tea');
    }))

module.exports = router;