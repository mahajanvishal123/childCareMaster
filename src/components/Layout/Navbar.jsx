
import { Container, Row, Col, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { FaSearch, FaBell, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // 🔁 Import navigation hook
import './Navbar.css';
import logo from '../../assets/logo.png';


const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');


  const handleLogout = () => {
    // localStorage.removeItem('role');
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="navbar-custom py-2 shadow-sm bg-white px-4">
      <Container fluid>
        <Row className="align-items-center justify-content-between">
          <Col xs="auto" className="d-flex align-items-center gap-1">
            <img src={logo} alt="logo" className="navbar-logo m-2" />
            <span className="navbar-title">KidiCloud</span>
            <div className="toggle-container d-md-none mt-3">
              <button  className="btn btn-sm btn-light toggle-btn"
                onClick={toggleSidebar}>
                <FaBars />
              </button>
            </div>
          </Col>

          <Col xs="auto" className="d-flex align-items-center gap-3">
            {/* <InputGroup className="d-none d-md-flex">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control type="text" placeholder="Search..." />
            </InputGroup> */}

            <Dropdown align="end">
              <Dropdown.Toggle as="div" className="cursor-pointer d-flex align-items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="avatar"
                  className="navbar-avatar rounded-circle me-2"
                  style={{ width: '35px', height: '35px' }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
    <Dropdown.Item onClick={() => navigate("/profile")}>My Profile</Dropdown.Item>
    <Dropdown.Item onClick={() => navigate("/change-password")}>Change Password</Dropdown.Item>
    <Dropdown.Item onClick={() => {
      handleLogout(); // call logout function
      navigate("/"); // redirect to login page
    }}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <FaBell size={20} className="text-secondary" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Navbar;
