import React from 'react';
import axios from "axios";
import { withRouter, Link } from "react-router-dom";
import Loader from '../Loader';

const url = "http://localhost:4000/api";

class Standings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: this.props.location.state?.message,
      accountType: "",
      interviewerId: "",
      dateTime: "",
      standings: []
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
      this.setState({ callingAPI: true });
      evt.preventDefault();
      const response2 = await axios.post(`${url}/sendmail`, { ...this.state }, {
        withCredentials: true
      });
    }
    catch (err) {
      history.push(`/sendmail`, { message: err.response.data });
    }
  }

  async componentDidMount() {
    try {

      setTimeout(() => {
        this.setState({ message: "" });
      }, 5000);
      const response1 = await axios.get(`${url}/profile/liveUser`, {
        withCredentials: true
      });

      setTimeout(() => {
        this.setState({ message: "" });
      }, 5000);
      const response = await axios.get(`${url}/contest/${this.props.match.params.contestID}/standings`, {
        withCredentials: true
      });
      // console.log(response);

      this.setState({ accountType: response1.data.accountType, standings: response.data.standings });
    }
    catch (err) {
      const { history } = this.props;
      history.push("/login", { message: err.response.data });
    }

  }


  render() {
    // console.log(this.state.problems);
    const buttonStyle = {
      padding: '10px 20px',
      fontSize: '1.1em',
      backgroundColor: '#007bff', // Blue color for the button
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '20px',
      marginLeft: '600px'
    };

    return (
      <div className='standings'>
        {this.state.message ? (<div className='alert alert-primary'>{this.state.message}</div>) : ""}
        {/* <h2 className='my-4 heading'>{`${this.state.contest.name} #${this.state.contest.number}`}</h2> */}
        <h3 className='my-4'>Send Email to Qualified Candidate</h3>
        <div className='d-flex flex-column align-items-center'>
          <form action="passwordRecovery" className='form my-4 d-flex flex-column align-items-center row container-xxs' onSubmit={this.handleSubmit}>
            <div className='username my-1 col-md-12'>
              <label className='col-md-5' htmlFor="username">Username</label>
              <input className='col-md-7' type="text" value="Hire Me" name="username"></input>
            </div>
            <div className='email my-1 col-md-12'>
              <label className='col-md-5' htmlFor="email">Email</label>
              <input className='col-md-7' type="email" onChange={this.handleChange} value={this.state.email} name="email"></input>
            </div>
            <button className="col-md-8 my-3 btn btn-outline-dark" type="submit">Send Email</button>
          </form>
        </div>

        <h3 className='my-4'>Contest Ranks</h3>
        <table className='table table-striped'>
          {/* <form> */}

          <thead>
            <th>#</th>
            <th>Who</th>
            <th>Points</th>
            <th>Accepted Count</th>

            {this.state.accountType === "organiser" && (
              <>
                <th>Threshold Points:
                  <select className='col-md-3' id="thresholdPoints" onChange={e => this.setState({ thresholdValue: parseInt(e.target.value) || 0 })}
                    name="threshold">
                    <option  value={0}>0</option>
                    <option value={50}>50</option>
                    <option selected value={100}>100</option>
                  </select>
                </th>
                {/* <th>Enter Interviewer Email</th>
                <th>Date and Time</th>
                <th>Send Email</th> */}
              </>
            )}

          </thead>
          <tbody>
            {this.state.standings.map((standing, idx) => {
              const qualifyMessage = standing.points >= this.state.thresholdValue ? "qualify" : "try again";
              return (
                <tr>
                  <td>{idx + 1}</td>
                  <td><Link to={`/profile/${standing.username}`}>{standing.username}</Link></td>
                  <td>{Math.floor(standing.points)}</td>
                  <td>{standing.acceptedCount}</td>

                  {this.state.accountType === "organiser" && (
                    <>
                      <td>{qualifyMessage}</td>
                    </>
                  )}
                </tr>
              )
            })}

          </tbody>
        </table>


      </div >
    )
  }
}

export default withRouter(Standings);
