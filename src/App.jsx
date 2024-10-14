import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import SignUpForm from './Signup';
import SignIn from './Login';
import Viewer from './Dashboard';
import HomePage from './HomePage';


const App = () => {
  const router= createBrowserRouter([{
    path: "/",
    element:<HomePage /> 
  },
  {
    path: "/signup",
    element: <SignUpForm />,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/dashboard/:id",
    element: <Viewer />,
  },
  ]);

   return <RouterProvider router={router}/>
};

export default App;
