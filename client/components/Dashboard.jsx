import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Modal from './Modal.jsx';
import Step from './Step.jsx';
import { UserContext } from '../App.jsx';

const appStatusLabel = {
  1: 'Not Applied',
  2: 'Applied',
  3: 'Phone Screening',
  4: 'Technical Interview',
  5: 'Interviewing',
  6: 'Offer Received',
  7: 'Offer Accepted',
  8: 'Offer Rejected',
  9: 'Application Rejected',
  10: 'Not Interested',
};

const Dashboard = () => {
  let history = useHistory();
  const [tracker, setTracker] = useState([]);
  const [showModal, setShowModal] = useState({ action: null, id: null }); // none / edit /add
  const [updateState, setUpdateState] = useState(true);

  const context = useContext(UserContext);
  console.log('context user', context.user.id);

  const fetchApplications = async () => {
    const resp = await fetch(`/user/${context.user.id}/application`, {
      method: 'GET',
      headers: { 'content-type': 'application/JSON' },
    });
    const data = await resp.json();
    console.log('fetchapp data==>', data, 'data type', typeof data);
    setTracker(data);
    setUpdateState(false);
  };

  // get the users data from the DB
  useEffect(() => {
    console.log('use effect fired');
    console.log('usereffect context user===>', context.user.id);
    if (updateState) fetchApplications();
  }, [updateState]);

  //Delete application from the DB
  const removeApplications = (id) => {
    fetch(`/user/${context.user.id}/application/${id}`, {
      method: 'DELETE',

      headers: {
        'content-type': 'application/JSON',
      },
    }).then((res) => {
      setUpdateState(true);
      // const del = tracker.filter((tracker) => id !== tracker.id);
      // setTracker(del);
      // console.log(id);
    });
  };

  //this is the header
  //Modify is for Edit, Delete, Add step functionality
  const renderHeader = () => {
    let headerElement = [
      // "id",
      'Company',
      'Title',
      'Location',
      'Found by',
      'Applied via',
      'Date applied',
      'Notes',
      'Status',
      'Modify',
    ];

    //now we will map over these values and output as th
    return headerElement.map((key, index) => {
      if (
        key === 'Found by' ||
        key === 'Applied via' ||
        key === 'Date applied' ||
        key === 'Notes'
      ) {
        return (
          <th key={index} className='low-priority-col'>
            {key}
          </th>
        );
      } else return <th key={index}>{key}</th>;
    });
  };

  const changeRoute = (e) => {
    const id = e.target.id;
    let path = `/application/${id}/step`;

    history.push(path);
  };

  const renderBody = () => {
    return (
      tracker &&
      tracker.map(
        (
          {
            id,
            job_title,
            company,
            found_by,
            how_applied,
            date_applied,
            location,
            notes,
            app_status,
            operation,
          },
          index
        ) => {
          return (
            <tr key={id}>
              <td id='hide-ID-col'>{id}</td>
              <td>{company}</td>
              <td>{job_title}</td>
              <td>{location}</td>
              <td className='low-priority-col'>{found_by}</td>
              <td className='low-priority-col'>{how_applied}</td>
              <td className='low-priority-col' id='date-column'>
                {new Date(date_applied).toLocaleDateString('en-US')}
              </td>

              <td className='low-priority-col' id='notes-column'>
                {notes}
              </td>
              <td>{appStatusLabel[app_status]}</td>
              <td className='operation'>
                <button
                  className='deleteButton'
                  onClick={() => setShowModal({ action: 'edit', id: index })}
                >
                  Edit
                </button>
                <button
                  className='button'
                  onClick={() => removeApplications(id)}
                >
                  Delete
                </button>

                <Link
                  to={{
                    pathname: `/application/${id}/step`,
                    state: { application: tracker[index] },
                  }}
                >
                  <button
                    src='step'
                    className='editStep'
                    // onClick={changeRoute} id={id}
                  >
                    View progress
                  </button>
                </Link>
              </td>
            </tr>
          );
        }
      )
    );
  };

  return (
    <>
      <h2 id='title'>Applications Dashboard</h2>
      <div className='tableContainer'>
        {context.user.id ? (
          <div>
            <table id='tracker'>
              <thead>
                <tr>{renderHeader()}</tr>
              </thead>
              <tbody>{renderBody()}</tbody>
            </table>
            <button
              onClick={() => {
                context.saveUser(null);
                history.goBack();
              }}
            >
              Sign out
            </button>

            <button onClick={() => setShowModal({ action: 'add', id: null })}>
              Add new application
            </button>
          </div>
        ) : (
          <p>
            Login first <Link to='/'>here</Link>
          </p>
        )}
      </div>

      {showModal.action ? (
        <Modal
          setShowModal={setShowModal}
          setUpdateState={setUpdateState}
          action={showModal.action}
          currentApp={showModal.action === 'edit' ? tracker[showModal.id] : {}}
        />
      ) : (
        <p></p>
      )}
    </>
  );
};
export default Dashboard;
