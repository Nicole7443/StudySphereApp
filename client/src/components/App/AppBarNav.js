import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../Firebase/context';
import { logOut } from '../Firebase/firebase';

function AppBarNav() {
  const navigate = useNavigate();
  const { user } = useFirebase();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('An error occurred during logout:', error.message);
    }
  };

  return { user, handleLogout };
}

export default AppBarNav;
