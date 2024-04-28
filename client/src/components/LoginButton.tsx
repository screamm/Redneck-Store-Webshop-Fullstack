const LoginButton = () => { 


    const Redirect = () => {
        window.location.href = "/loginpage";
    }

    return (
        <button onClick={Redirect} className="ml-7 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out mt-4">Log In</button>
    );
    }

    export default LoginButton;