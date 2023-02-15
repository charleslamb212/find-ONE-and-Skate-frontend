import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Login from '../components/pages/Login';
import Register from '../components/pages/Register';

export default function Navbar(props) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!props.currentUser);

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);
  const openRegisterModal = () => setRegisterModalOpen(true);
  const closeRegisterModal = () => setRegisterModalOpen(false);

  const handleLogin = () => {
    setLoggedIn(true);
    closeLoginModal();
  };

  const handleLogout = () => {
    props.handleLogout();
    setLoggedIn(false);
  };

  return (
    <nav className="navbar">
      {loggedIn ? (
        <>
          <Link to="/">🛹FOAS</Link>
          <Link to="/profile">Profile</Link>
          <span onClick={handleLogout}>Log out</span>
        </>
      ) : (
        <>
          <Link to="/">🛹FOAS</Link>
          <span onClick={openLoginModal}>Login</span>
          <span onClick={openRegisterModal}>Register</span>
        </>
      )}
      <Modal isOpen={loginModalOpen} onRequestClose={closeLoginModal} className="custom-modal">
        <Login onClose={closeLoginModal} onLogin={handleLogin} />
      </Modal>
      <Modal isOpen={registerModalOpen} onRequestClose={closeRegisterModal} className="custom-modal">
        <Register onClose={closeRegisterModal} />
      </Modal>
    </nav>
  );
}
