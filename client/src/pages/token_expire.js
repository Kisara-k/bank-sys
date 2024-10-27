import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime; 
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};

export default isTokenExpired;
