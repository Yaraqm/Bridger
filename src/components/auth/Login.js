import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleGuest = () => {
        navigate('/guest-dashboard');
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            const container = document.querySelector('.login-container');
            const box = document.querySelector('.login-box');

            // Check if mouse is outside the white box
            const boxRect = box.getBoundingClientRect();
            if (
                e.clientX > boxRect.left &&
                e.clientX < boxRect.right &&
                e.clientY > boxRect.top &&
                e.clientY < boxRect.bottom
            ) {
                return; // Don't create ripple inside the box
            }

            // Create the ripple
            const ripple = document.createElement('div');
            ripple.className = 'mouse-ripple';
            ripple.style.left = `${e.pageX}px`;
            ripple.style.top = `${e.pageY}px`;
            container.appendChild(ripple);

            // Remove the ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 1500); // Allow ripple to complete animation
        };

        const container = document.querySelector('.login-container');
        container.addEventListener('mousemove', handleMouseMove);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="login-container">
            <div className="login-box">
                <div>
                    <h1 style={styles.header}>Welcome to Bridger</h1>
                    <p style={styles.subtitle}>How would you like to log in?</p>
                </div>
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={() => navigate('/member-login')}>
                        Member
                    </button>
                    <button style={styles.button} onClick={() => navigate('/admin-login')}>
                        Admin
                    </button>
                </div>
                <div style={styles.footerContainer}>
                    <div style={styles.dividerContainer}>
                        <hr style={styles.divider} />
                        <p style={styles.orText}>or</p>
                        <hr style={styles.divider} />
                    </div>
                    <p style={styles.guestText} onClick={handleGuest}>
                        Continue as Guest
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#CDD5E8',
        fontFamily: 'Raleway, sans-serif',
    },
    box: {
        width: '450px',
        padding: '30px',
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        fontFamily: 'Raleway, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '70vh',
        position: 'relative',
    },
    header: {
        fontSize: '55px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#000',
        fontFamily: 'Raleway, sans-serif',
    },
    subtitle: {
        fontSize: '18px',
        margin: '10px 0 20px',
        color: '#666',
        fontFamily: 'Raleway, sans-serif',
        fontWeight: '500',
    },
    buttonContainer: {
        marginBottom: '20px',
        padding: '0 30px', // Add padding to create space
        fontFamily: 'Raleway, sans-serif',
    },
    button: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#00004A',
        color: '#fff',
        fontSize: '18px',
        cursor: 'pointer',
        fontFamily: 'Raleway, sans-serif',
    },
    footerContainer: {
        marginTop: 'auto', // Push the footer to the bottom
        textAlign: 'center',
    },
    dividerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Raleway, sans-serif',
    },
    divider: {
        flex: 1,
        border: '0.5px solid #CDD5E8',
        fontFamily: 'Raleway, sans-serif',
    },
    orText: {
        margin: '0 10px',
        color: '#666',
        fontSize: '14px',
        fontFamily: 'Raleway, sans-serif',
    },
    guestText: {
        marginTop: '10px',
        color: '#9E44DA',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '501',
        fontFamily: 'Raleway, sans-serif',
    },
};

export default Login;