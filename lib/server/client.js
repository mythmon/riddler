import express from 'express';

const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
  strict: false,
});

router.get('/', (req, res) => {
  res.json({msg: 'Hello, world!'});
  res.end();
});

export default router;
