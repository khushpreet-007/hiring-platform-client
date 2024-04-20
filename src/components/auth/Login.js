import React from 'react';
import axios from "axios";
import { withRouter, Link } from "react-router-dom";
import background from "../assets/Login.png";

const url = "http://localhost:4000/api";

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: this.props.location.state?.message,
      username: "",
      password: ""
    }
  }

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  handleSubmit = async (evt) => {
    evt.preventDefault();
    const { history } = this.props;
    try {
      const response = await axios.post(`${url}/login`, { ...this.state }, { withCredentials: true });
      document.cookie = `accessToken=${response.data.accessToken}`;
      history.push(`/`);

      // history.push(`/profile/${this.state.username}`, { message: response.data });
    } catch (err) {
      history.push(`/login`, { message: err.response.data });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ message: "" });
    }, 5000);
  }

  render() {

    const myStyle = {
      backgroundImage: `url(${background})`,
      height: "100vh",
      marginTop: "5px",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "white", 
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", 
      padding: "20px" 
    };

    const contentStyle = {
      marginTop: '45px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      justifyContent: "center",
      color: 'black', 
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      padding: '20px', 
      position: 'relative', 
      zIndex: 1 
    };

    return (
      <div style={{ position: 'relative' }}>
        <div style={myStyle}>
          {/* <h1 style={textStyle}>Get Your Dream Job</h1>
            <p style={textStyle}>One Portal Multiple Jobs</p>
            <button style={buttonStyle}>Explore Jobs</button>
            <button style={buttonStyle}>Preparation</button> */}
          <div style={contentStyle}>
            <div className='login d-flex flex-column align-items-center'>
              {this.state.message ? (<div className='alert alert-primary' style={{ width: "100%", textAlign: "center" }}>{this.state.message}</div>) : ""}
              <h2 className='mt-4'>Login</h2>
              <form action="/login" className='username form d-flex flex-column align-items-center my-4 row container-xxs' onSubmit={this.handleSubmit}>
                <div className='username col-md-12 my-1'>
                  <label htmlFor="username" className="col-md-5">Username</label>
                  <input type="text" onChange={this.handleChange} className="col-md-7" value={this.state.username} name="username"></input>
                </div>
                <div className='password col-md-12 my-1'>
                  <label htmlFor="password" className="col-md-5">Password</label>
                  <input type="password" minLength={8} className="col-md-7" onChange={this.handleChange} value={this.state.password} name="password"></input>
                </div>
                {/* <button type="submit" className="col-md-4  my-3 btn btn-outline-dark">Login</button> */}
                <button type="submit" className="col-md-4  my-3 btn btn-outline-dark btn btn-primary">Login</button>
                <Link to='/passwordRecovery' className='forgotPassword'>Forgot password</Link>
                <span className='newUser'>New user? <Link to='/register'>Register</Link></span>
              </form>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default withRouter(Login);
