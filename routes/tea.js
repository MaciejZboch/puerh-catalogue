const express = require('express');
const router = express.Router();
const Tea = require('../models/tea')
const catchAsync = require('../utilities/catchAsync')
const DataTable = require("datatables.net-dt");



router.get('/', (req, res) => {
    res.render('teas/index')
})
router.get('/browse', (req, res) => {
    res.render('teas/browse', {Tea, DataTable})
})
router.post('/', async (req, res) => {
    const newTea = new Tea(req.body.tea)
    await newTea.save()
    res.redirect('/tea')
})
router.get('/new', (req, res) => {
    res.render('teas/new')
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