import React from 'react';
import axios from "axios";
import { withRouter, Link } from "react-router-dom";
import background from "../assets/Login.png";

const url = "http://localhost:4000/api";

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: this.props.location.state?.message,
      username: "",
      email: "",
      password: "",
      accountType: "contestant"
    }
  }

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  handleSubmit = async (evt) => {
    const { history } = this.props;
    try {
      evt.preventDefault();
      // console.log(this.state);
      const response = await axios.post(`${url}/register`, { ...this.state }, {
        withCredentials: true
      });
      // console.log(response);
      // document.clearCookie("accessToken");
      // document.cookie = `accessToken=${response.data.accessToken}`
      history.push(`/profile/${this.state.username}`, { message: response.data });
    }
    catch (err) {
      // console.log(err);
      history.push(`/register`, { message: err.response.data });
      // window.location.reload();
    }
  }

  componentDidMount() {
    // console.log(this.props);
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
      // justifyContent: 'center',
      // alignItems: 'center',
      // textAlign: 'center',
      // justifyContent: "center",
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
          <div className='register d-flex flex-column align-items-center'>
            {this.state.message ? (<div className='alert alert-primary' style={{ width: "100%", textAlign: "center" }}>{this.state.message}</div>) : ""}
            <h2 className='mt-5'>Register</h2>
            <form action="/register" className='form my-4 d-flex flex-column align-items-center row container-xxs' onSubmit={this.handleSubmit}>
              <div className='username my-1 col-md-12'>
                <label className='col-md-5' htmlFor="username">Username</label>
                <input className='col-md-7' type="text" onChange={this.handleChange} value={this.state.username} name='username'></input>
              </div>
              <div className='email my-1 col-md-12'>
                <label className='col-md-5' htmlFor="email">Email</label>
                <input className='col-md-7' type="email" onChange={this.handleChange} value={this.state.email} name='email'></input>
              </div>
              <div className='password my-1 col-md-12'>
                <label className='col-md-5' htmlFor="password">Password</label>
                <input className='col-md-7' type="password" minLength={8} onChange={this.handleChange} value={this.state.password} name='password'></input>
              </div>
              <div className='password my-1 col-md-12'>
                <label className='col-md-6' for="accountType">Select account type</label>
                <select className='col-md-6 py-1' name="accountType" onChange={this.handleChange} value={this.state.accountType} id="accountType">
                  <option selected value="contestant">Contestant</option>
                  <option value="organiser">Organiser</option>
                </select>
              </div>
              <button className="col-md-4 my-3 btn btn-outline-dark" type="submit">Register</button>
              <span className='newUser'>Already have a account? <Link to='/Login'>Login</Link></span>
            </form>
          </div>
          </div>
        </div>

      </div>


    )
  }
}

export default withRouter(Register);
