const router = require('express').Router();
const Note = require('../models/Note');
router.get('/notes', async (req, res) => res.json(await Note.find()));
router.post('/notes', async (req, res) => res.status(201).json(await Note.create(req.body)));
router.put('/notes/:id', async (req, res) => res.json(await Note.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/notes/:id', async (req, res) => { await Note.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
module.exports = router;
