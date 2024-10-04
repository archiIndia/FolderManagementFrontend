import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
    <div>
      <Link to={'/signup'}>
        <button>SignUp</button>
      </Link>
      </div>
      <br />
      <div>
      <Link to={'/login'}>
        <button>LogIn</button>
      </Link>
    </div>
    </div>
  );
};

export default HomePage;
