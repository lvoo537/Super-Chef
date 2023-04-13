import { useEffect } from 'react';
import { useAuthContext } from '../../contexts/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
    const { setAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        setAuthenticated(false);
        navigate('/login');
    }, [setAuthenticated, navigate]);

    return <div></div>;
}

export default LogoutPage;
