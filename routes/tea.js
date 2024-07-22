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


router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    const vendors = await Vendor.find();
    const producers = await Producer.find();
    res.render('teas/new', {currentYear, vendors, producers})
}))
router.post('/', isLoggedIn, upload.array('image'), validateTea, async (req, res) => {
    const newTea = new Tea(req.body.tea);
    newTea.author = req.user._id;
    newTea.vendor = await Vendor.findOne({ name: req.body.vendor.name});
    newTea.producer = await Producer.findOne({ name: req.body.producer.name});
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

router.get('/:id/edit', isLoggedIn, isAuthor, validateTea, catchAsync(async (req, res) => {
    const t = await Tea.findById(req.params.id).populate('vendor').populate('producer');
    if (!t) {
        req.flash('error', 'Cannot find that tea!')
        return res.redirect('/tea')}
        const vendors = await Vendor.find();
        const producers = await Producer.find();    
    res.render('teas/edit', {t, currentYear, vendors, producers})
}))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateTea, catchAsync(async (req, res) => {
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

    router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
        await Tea.findByIdAndDelete(req.params.id);
        res.redirect('/tea');
    }))

module.exports = router;