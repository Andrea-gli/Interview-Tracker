const db = require('../models/model.js');
const bcrypt = require('bcrypt');

const userController = {};

userController.getUserData = (req, res, next) => {
  const UID = req.params.user_id;

  // get user's personal data
  const getUserData = 'SELECT * FROM job_seekers WHERE id = $1';

  db.query(getUserData, [UID]) // array of variables to use in query
    .then((data) => {
      res.locals.userData = data.rows[0];

      return next();
    })
    .catch((err) => {
      console.log('errorrr===>', err);
      return next({
        log: 'usersController.getUserData: ERROR: Error getting database',
        message: {
          err: 'usersController.getUserData: ERROR: Check database for details',
        },
      });
    });
};

userController.createUser = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      cur_salary,
      DOB,
    } = req.body;

    if (!first_name || !last_name || !email || !password)
      return res.sendStatus(401);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createUserText =
      'INSERT INTO job_seekers (first_name, last_name, email, password, cur_salary, DOB) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const createUserVals = [
      first_name,
      last_name,
      email,
      hashedPassword,
      cur_salary,
      DOB,
    ];
    const data = await db.query(createUserText, createUserVals);
    res.locals.id = data.rows[0].id;

    return next();
  } catch (err) {
    console.log('createuser err=====>', err);
    return next({
      log: 'usersController.addUser: ERROR: Error writing to database',
      message: {
        err: 'usersController.addUser: ERROR: Check database for details',
      },
    });
  }
};

userController.verifyUser = async (req, res, next) => {
  const { username, password } = req.body;
  console.log('req.body===>', req.body);

  if (!username || !password) return res.sendStatus(401);

  try {
    const verifyUserText = `SELECT * FROM job_seekers WHERE email = $1`;
    const verifyUserData = [username];

    const data = await db.query(verifyUserText, verifyUserData);

    const hashedPassword = data.rows[0].password;
    console.log('data.rows--->', data.rows);

    if (!hashedPassword) return res.sendStatus(401);
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) return res.sendStatus(401);
    res.locals.id = data.rows[0].id;
    return next();
  } catch (err) {
    console.log('errrrr===>', err);
    return next({
      log: 'usersController.verifyUser: ERROR: Unable to verify user data.',
      message: {
        err: `usersController.verifyUser: ERROR: ${err}`,
      },
    });
  }
};

// userController.editUser = (req, res, next) => {

// };

// userController.deleteUser = (req, res, next) => {
//     // delete all apps and all steps
// };

module.exports = userController;
