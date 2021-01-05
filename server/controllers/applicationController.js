const db = require('../models/model.js');

const applicationController = {};

applicationController.getAllApps = (req, res, next) => {
  const UID = req.params.user_id;
  // get user's personal data
  const getAppData =
    'SELECT * FROM applications WHERE job_seeker_id = $1 ORDER BY id ASC';
  db.query(getAppData, [UID]) // array of variables to use in query
    .then((data) => {
      // console.log(data.rows);
      res.locals.userData = data.rows;
      return next();
    })
    .catch((err) => {
      return next({
        log:
          'applicationsController.getUserData: ERROR: Error getting database',
        message: {
          err:
            'applicationsController.getUserData: ERROR: Check database for details',
        },
      });
    });
};

applicationController.addApp = (req, res, next) => {
  const UID = req.params.user_id;
  console.log('UID is:', UID);
  const {
    company,
    job_title,
    how_applied,
    date_applied,
    location,
    found_by,
    notes,
    app_status,
  } = req.body;

  const addApp =
    'INSERT INTO applications (job_seeker_id, company, job_title, how_applied, date_applied, location, found_by, notes, app_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';

  db.query(addApp, [
    UID,
    company,
    job_title,
    how_applied,
    date_applied,
    location,
    found_by,
    notes,
    app_status,
  ])
    .then((data) => {
      console.log(data.rows);
      return next();
    })
    .catch((err) => {
      console.log('erradding===>', err);
      return next({
        log: 'applicationsController.addApp: ERROR: Error writing to database',
        message: {
          err:
            'applicationsController.addApp: ERROR: Check database for details',
        },
      });
    });
};

applicationController.deleteApp = (req, res, next) => {
  const queryText = 'DELETE FROM applications WHERE id = $1';
  const queryVal = [req.params.app_id];
  console.log('queryVal--->', queryVal);

  db.query(queryText, queryVal)
    .then(({ rows }) => {
      console.log('rows==>', rows);
      res.locals.transaction = rows;
      return next();
    })
    .catch((err) => {
      console.log('delete app error===>', err);
      return next({
        log:
          'applicationsController.deleteApp: ERROR: Error deleting application from database',
        message: {
          err:
            'applicationsController.deleteApp: ERROR: Check database for details',
        },
      });
    });
};

applicationController.editApp = (req, res, next) => {
  const {
    company,
    job_title,
    how_applied,
    date_applied,
    location,
    found_by,
    notes,
    app_status,
  } = req.body;
  const queryText = `UPDATE applications 
                     SET company = $1, 
                     job_title = $2, 
                     how_applied = $3, 
                     date_applied = $4, 
                     location = $5, 
                     found_by = $6, 
                     notes = $7, 
                     app_status= $8
                     WHERE id = $9`;
  const queryVals = [
    company,
    job_title,
    how_applied,
    date_applied,
    location,
    found_by,
    notes,
    app_status,
    Number(req.params.app_id),
  ];
  console.log(queryVals);
  db.query(queryText, queryVals)
    .then(({ rows }) => {
      res.locals.transaction = rows;
      return next();
    })
    .catch((err) => {
      return next({
        log:
          'applicationsController.updateApp: ERROR: Error updating application in database',
        message: {
          err:
            'applicationsController.updateApp: ERROR: Check database for details',
        },
      });
    });
};

module.exports = applicationController;
