import React,{useState} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {setAlert} from '../../actions/alert'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom';

//component
const Register = ({setAlert}) => {

const [formData, setFormData] = useState({
    name:"",
    email:"",
    password:"",
    password2:""
});

const {name, email, password, password2} = formData;

const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

const onSubmit = async (e) => {
    e.preventDefault();
    if(password != password2){
        setAlert("passwords do not match","danger")
    }
    else{
        console.log('Success')
    }
}

    return (
        <>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input 
                    type="text"
                     placeholder="Name"
                      name="name" 
                      value={name}
                      onChange={e =>  onChange(e)}
                      required />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address"
                    value={email}
                    name="email"
                    onChange={e =>  onChange(e)}
                    required
                    />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
                    >
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        onChange={e =>  onChange(e)}
                        value={password}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        onChange={e =>  onChange(e)}
                        value={password2}
                        required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to='/login'>Login</Link>
            </p>
        </>
    )
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
}

export default connect(null, {setAlert})(Register)
