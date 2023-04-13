import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuthContext } from '../../contexts/Auth/AuthContext';

export default function PrivateRoute() {
    const { authenticated } = useAuthContext();
    const params = useParams();

    if (authenticated) {
        return <Outlet />;
    } else {
        return <Navigate to={`/login?next=${params.path}`} replace />;
    }
}
