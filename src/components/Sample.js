import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Modal, Form, Row, Col } from 'react-bootstrap';

const Sample = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserAge, setNewUserAge] = useState('');
  const [newUserGender, setNewUserGender] = useState('male');
  const [newUserFood, setNewUserFood] = useState('');
  const [newUserHobbies, setNewUserHobbies] = useState('');
  const [newUserDob, setNewUserDob] = useState('');

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!newUserName) {
      errors.name = 'Name is required';
    }
    if (!newUserAge) {
      errors.age = 'Age is required';
    } else if (isNaN(newUserAge) || newUserAge <= 0) {
      errors.age = 'Age must be a positive number';
    }
    // Add more validation rules for other fields here

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleSave = () => {
    if (!validateForm()) {
      return; // Form validation failed, do not proceed
    }

    const newUser = {
      id: Date.now(),
      name: newUserName,
      age: newUserAge,
      gender: newUserGender,
      favoriteFood: newUserFood,
      hobbies: newUserHobbies,
      dob: newUserDob,
    };

    if (selectedUser) {
      // Edit existing user
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id ? { ...selectedUser, ...newUser } : u
      );
      setUsers(updatedUsers);
    } else {
      // Add new user
      setUsers([...users, newUser]);
    }

    closeModal();
    setNewUserName('');
    setNewUserAge('');
    setNewUserGender('male');
    setNewUserFood('');
    setNewUserHobbies('');
    setNewUserDob('');
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
  };

  const getColorTheme = (age) => {
    if (age <= 25) {
      return 'green';
    } else if (age <= 50) {
      return 'purple';
    } else {
      return 'orange';
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    users.length
  );
  const paginatedUsers = users.slice(startIndex, endIndex);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#">User Dashboard</Navbar.Brand>
          <Nav className="ml-auto">
            <Button variant="primary" onClick={() => openModal(null)}>
              Add User
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-3">
        <Row>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            {paginatedUsers.map((user, index) => (
              <Col lg={4} key={user.id}>
                <div style={{width:"20rem"}}
                  className={`user-details-box age-${getColorTheme(user.age)}`}
                >
                  <h3>{user.name}</h3>
                  <p>Age: {user.age}</p>
                  <p>Gender: {user.gender}</p>
                  <p>Favorite Food: {user.favoriteFood}</p>
                  <p>Hobbies: {user.hobbies}</p>
                  <p>Date of Birth: {user.dob}</p>
                  <Button variant="primary" onClick={() => openModal(user)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => deleteUser(user.id)}>
                    Delete
                  </Button>
                  <Button variant="info" onClick={() => openModal(user)}>
                    View
                  </Button>
                </div>
              </Col>
            ))}
          </div>
        </Row>
      </Container>

      <div className="d-flex justify-content-center mt-3">
        {currentPage > 1 && (
          <Button
            variant="success"
            onClick={() => handlePageChange(currentPage - 1)}
            className="mr-2"
          >
            Previous Page
          </Button>
        )}
        {currentPage < Math.ceil(users.length / itemsPerPage) && (
          <Button
            variant="danger"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next Page
          </Button>
        )}
      </div>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUser ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUserName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formUserAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter age"
                value={newUserAge}
                onChange={(e) => setNewUserAge(e.target.value)}
                isInvalid={!!formErrors.age}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.age}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formUserGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                value={newUserGender}
                onChange={(e) => setNewUserGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formUserFood">
              <Form.Label>Favorite Food</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter favorite food"
                value={newUserFood}
                onChange={(e) => setNewUserFood(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formUserHobbies">
              <Form.Label>Hobbies</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter hobbies"
                value={newUserHobbies}
                onChange={(e) => setNewUserHobbies(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formUserDob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={newUserDob}
                onChange={(e) => setNewUserDob(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
          <Button variant="danger" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sample;
