import { Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/Auth/AuthContext';

export default function PrivateRoute(props) {
    const { authenticated } = useAuthContext();
    return authenticated ? <Route {...props} /> : <Navigate to="/login" />;
}
