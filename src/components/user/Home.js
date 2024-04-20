import React from 'react';
import axios from "axios";
import { v4 as uuid } from "uuid";
import { withRouter, Link } from "react-router-dom";
import CountdownTimer from '../CountdownTimer';
import background from "../assets/home-page.png";
import videoBackground from '../assets/tree.mp4';

const url = "http://localhost:4000/api";

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: this.props.location.state?.message,
      contests: [],
    }
  }

  upvote = async (evt) => {
    const { history } = this.props;
    try {
      const response = await axios.get(`${url}/contest/${evt.target.getAttribute("name")}/upvote`, {
        withCredentials: true
      })
      // console.log(response);
      // this.setState({key: uuid()});
      history.push("/", { message: response.data });
    }
    catch (err) {
      // const history = this.props;
      // console.log(err);
      history.push("/login", { message: err.response.data });
    }
  }

  handleExplore = (evt) => {
    const { history } = this.props;
    try {
      history.push('/allContests');
    }
    catch (err) {
      history.push('/login', { message: err.response.data });
    }
  }
  handlePractice = (evt) => {
    const { history } = this.props;
    try {
      history.push('/problems');
    }
    catch (err) {
      history.push('/login', { message: err.response.data });
    }
  }



  async componentDidMount() {
    try {
      setTimeout(() => {
        this.setState({ message: "" });
      }, 5000);
      const response = await axios.get(`${url}/`, {
        withCredentials: true
      });

      this.setState({ contests: response.data.contests });
    }
    catch (err) {
      const { history } = this.props;
      history.push("/login", { message: err.response.data });
    }

  }

  render() {

    const myStyle = {
      backgroundImage: `url(${background})`,
      height: "100vh",
      marginTop: "-70px",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
      padding: "20px"
    };


    const textStyle = {
      marginLeft: '600px'
    };

    const buttonStyle = {
      padding: '10px 20px',
      fontSize: '1.1em',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '20px',
      marginLeft: '600px'
    };

    let array = [];
    for (let contest of this.state.contests) {
      let timestmp = 0;
      if (new Date(contest.startsAt).getTime() > Date.now()) timestmp = new Date(contest.startsAt).getTime() - Date.now();
      else timestmp = new Date(contest.endsAt).getTime() - Date.now();
      timestmp = Math.floor(timestmp / 1000);
      let hr = Math.floor(timestmp / 3600);
      let mn = Math.floor((timestmp % 3600) / 60);
      let sc = timestmp % 60;
      array.push({ hr, mn, sc });
    }
    return (
      <div className='home'>

        {this.state.message ? (<div className='alert alert-primary'>{this.state.message}</div>) : ""}
        <div>
          <div style={myStyle}>
            <h1 style={textStyle}>Get Your Dream Job</h1>
            <p style={textStyle}>One Portal Multiple Jobs</p>
            <button onClick={this.handleExplore} style={buttonStyle}>Explore Jobs</button>
            <button onClick={this.handlePractice} style={buttonStyle}>Preparation</button>
          </div>


        </div>

        {this.state.contests.map((contest, idx) => {
          return (
            <div className='m-2 bg-light'>
              <div className='border-bottom text text-dark d-flex justify-content-between p-3'>
                <span className='d-flex flex-column align-items-start'>
                  <Link to={`/contest/${contest._id}/announcement/get`}>{`${contest.name} #${contest.number}`}</Link>
                  {new Date(contest.endsAt).getTime() < Date.now()
                    ?
                    <div></div>
                    :
                    <div className='badge text-bg-light'>
                      <span>{new Date(contest.startsAt).getTime() <= Date.now() ? "Ends in" : "Starts in"} </span>
                      {array[idx].hr < 24 ? (<CountdownTimer hours={array[idx].hr} minutes={array[idx].mn} seconds={array[idx].sc} />) : (<div>{Math.floor(array[idx].hr / 24)} days</div>)}
                    </div>}
                </span><span>{String(new Date(new Date(contest.startsAt).getTime() + (5.5 * 60 * 60 * 1000)))}</span>
              </div>
              <div className='border-bottom  p-3'>{contest.announcement}</div>
              <div className='border-bottom text text-dark d-flex justify-content-between p-3'><span name={contest._id} className='btn' onClick={this.upvote}><i name={contest._id} class="px-2 fa-regular fa-thumbs-up"></i>{contest.upvotes}</span><Link to={`/contest/${contest._id}/announcement/get`} className='btn'><i class="px-2 fa-solid fa-user"></i>{contest.comments}</Link></div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default withRouter(Home);
