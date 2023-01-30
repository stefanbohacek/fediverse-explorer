import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('../views/home.handlebars', {
        timestamp: Date.now()
    });
});

export default router;