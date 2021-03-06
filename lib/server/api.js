import express from 'express';

const router = express.Router({
  caseSensitive: false,
  mergeParams: true,
  strict: false,
});

router.get('/', (req, res) => {
  res.json({msg: 'Hello, world!'});
  res.end();
});

export default router;
