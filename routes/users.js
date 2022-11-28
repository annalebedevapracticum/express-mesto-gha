const router = require('express').Router();
const { createUser, getUser, getUsers, updateAvatar, updateUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUser );
router.patch('/me/avatar', updateAvatar);

module.exports = router;