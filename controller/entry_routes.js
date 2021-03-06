const { response } = require('express')
const express = require('express')
const router = express.Router()
const Entry = require('../models/practice')
const Practice = require('../models/practice')

////////////////////////////////
// POST - Create Entry
////////////////////////////////
router.post('/:practiceId', (req, res) => {
    const practiceId = req.params.practiceId;
    req.body.author = req.body.userId;
    Practice.findById(practiceId)
    .then(practice => {
        practice.entries.push(req.body);
        return practice.save()
    })
    .then(practice => {
        res.redirect(`/practices/${practice._id}`)
    })
    .catch(err => {
        res.json(err)
    })
})

////////////////////////////////
// DELETE - Delete Entry
////////////////////////////////
router.delete('/delete/:practiceId/:entryId', (req,res) => {
    const practiceId = req.params.practiceId;
    const entryId = req.params.entryId;
    Practice.findById(practiceId)
        .then(practice => {
            const entry = practice.entries.id(entryId)
            entry.remove()
            return practice.save()
        })
        .then(practice => {
            res.redirect(`/practices/${practiceId}`)
        })
        .catch(err => {
            res.send(err)
        })
})

////////////////////////////////
// DELETE - Delete ALL Entries
////////////////////////////////
router.delete('/deleteAll/:practiceId', (req,res) => {
    const practiceId = req.params.practiceId;
    Practice.findById(practiceId)
        .then(practice => {
            const entries = practice.entries
            console.log(entries)
            if (entries.length > 0) {
                entries.pop()
            }
            return practice.save()
        })
        .then(practice => {
            res.redirect(`/practices/${practiceId}`)
        })
        .catch(err => {
            res.send(err)
        })
})

////////////////////////////////
// GET - display an update form for entry
////////////////////////////////
router.get('/:practiceId/:entryId/edit', (req,res) => {
    // query
    const practiceId = req.params.practiceId;
    const entryId = req.params.entryId
    Practice.findById(practiceId)
        .then(practice => {
            const entry = practice.entries.id(entryId)
            console.log(practice)
            // this will show the edit form for the entry
            //console.log(entry)
            res.render('users/editEntry.liquid', { practice, entry })
            })
        .catch(err => {
            res.json(err)
        })
})

////////////////////////////////
// PUT - Update the entry details
////////////////////////////////
router.put('/:practiceId/:entryId', (req, res) => {
    // find practice by ID, update it's subdoc with what's in req.body
    const practiceID = req.params.practiceId;
    const entryId = req.params.entryId
    console.log(req.body)
    Practice.findById(practiceID)
        .then(practice => {
            const entry = practice.entries.id(entryId)
            entry.minutes = req.body.minutes;
            return practice.save()
        })
        .then(practice => {
            const entry = practice.entries.id(entryId)
            entry.piece = req.body.piece;
            return practice.save()
        })
        .then(practice => {
            const entry = practice.entries.id(entryId)
            entry.composer = req.body.composer;            
            return practice.save()
        })
        .then(practice => {
            const entry = practice.entries.id(entryId)
            entry.note = req.body.note;            
            return practice.save()
        })
        .then(practice => {
            res.redirect(`/practices/${practiceID}`)
        })
        .catch(err => {
            res.json(err)
        })
    .catch(err => {
        res.json(err)
    })
})


////////////////////////////////
// Export router
////////////////////////////////
module.exports = router