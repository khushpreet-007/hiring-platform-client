import React from 'react';
import axios from "axios";
import { withRouter, Link } from "react-router-dom";

const url = "http://localhost:4000/api";

class Contests extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: this.props.location.state?.message,
      upcommingContests: [],
      historyContests: [],

      pastcurrentPage: 1,
      futurecurrentPage: 1,
      contestsPerPage: 3, // Number of contests to display per page
    }
  }

  async componentDidMount() {
    try {
      // console.log(this.props);
      setTimeout(() => {
        this.setState({ message: "" });
      }, 5000);
      const response = await axios.get(`${url}/allContests`, {
        withCredentials: true
      });
      // console.log("hello");
      // console.log(response);
      this.setState({ upcommingContests: response.data.upcommingContests, historyContests: response.data.historyContests });
    }
    catch (err) {
      const { history } = this.props;
      history.push("/login", { message: err.response.data });
    }

  }

  futurehandlePrevPage = () => {
    this.setState(prevState => ({ futurecurrentPage: prevState.futurecurrentPage - 1 }));
  };

  futurehandleNextPage = () => {
    this.setState(prevState => ({ futurecurrentPage: prevState.currentPage + 1 }));
  };

  pasthandlePrevPage = () => {
    this.setState(prevState => ({ pastcurrentPage: prevState.pastcurrentPage - 1 }));
  };

  pasthandleNextPage = () => {
    this.setState(prevState => ({ pastcurrentPage: prevState.pastcurrentPage + 1 }));
  };

  render() {
    const futureindexOfLastContest = this.state.futurecurrentPage * this.state.contestsPerPage;
    const futureindexOfFirstContest = futureindexOfLastContest - this.state.contestsPerPage;
    const futureContests = this.state.upcommingContests.slice(futureindexOfFirstContest, futureindexOfLastContest);

    const pastindexOfLastContest = this.state.pastcurrentPage * this.state.contestsPerPage;
    const pastindexOfFirstContest = pastindexOfLastContest - this.state.contestsPerPage;
    const pastContests = this.state.historyContests.slice(pastindexOfFirstContest, pastindexOfLastContest);
 
    const buttonStyle = {
      padding: '7px 15px',
      backgroundColor: '#007bff', // Blue color for the button
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      margin:'10px'
    };
    // console.log(this.state);
    return (
      
      <div className='contests'>
        {this.state.message ? (<div className='alert alert-primary'>{this.state.message}</div>) : ""}
        <h2 className='my-4 heading'>Hiring Challenge</h2>
        <table className='table'>
          <thead>
            <tr>
              <td colSpan={5}>Upcomming Challenges</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Hiring Challenge</th>
              <th>Start time</th>
              <th>Authors</th>
              <th>Registrations</th>
              <th>Length</th>
            </tr>

            {futureContests.map(contest => {
              return (
                <tr>
                  <td><Link to={`/contest/${contest._id}/announcement/get`}>{`${contest.name} #${contest.number}`}</Link></td>
                  <td>{String(new Date(new Date(contest.startsAt).getTime() + (5.5 * 60 * 60 * 1000)))}</td>
                  <td className='d-flex flex-column align-items-center'>{contest.authors.map(author => {
                    return (<Link to={`/profile/${author.username}`} className='badge text-bg-light my-1'>
                      {author.username}
                    </Link>)
                  })}</td>
                  <td>{contest.registrations.length}</td>
                  <td>{contest.duration}</td>

                </tr>)
            })}</tbody>
        </table>


        <button onClick={this.futurehandlePrevPage} style={buttonStyle} disabled={this.state.futurecurrentPage === 1}>Previous Page</button>
        <button onClick={this.futurehandleNextPage} style={buttonStyle} disabled={futureindexOfLastContest >= this.state.upcommingContests.length}>Next Page</button>

        <table className='table'>
          <thead>
            <tr>
              <td colSpan={5}>Previous Challenges</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Hiring Challenge</th>
              <th>Start time</th>
              <th>Authors</th>
              <th>Registrations</th>
              <th>Length</th>
            </tr>
            {pastContests.map(contest => {
              return (
                <tr>
                  <td><Link to={`/contest/${contest._id}/announcement/get`}>{`${contest.name} #${contest.number}`}</Link></td>
                  <td>{String(new Date(new Date(contest.startsAt).getTime() + (5.5 * 60 * 60 * 1000)))}</td>
                  <td className='d-flex flex-column align-items-center'>{contest.authors.map(author => {
                    return (<Link to={`/profile/${author.username}`} className='badge text-bg-light my-1'>
                      {author.username}
                    </Link>)
                  })}</td>
                  

                  <td>{contest.registrations.length}</td>
                  <td>{contest.duration}</td>
                </tr>)
            })}
          </tbody>
        </table>

        <button onClick={this.pasthandlePrevPage} style={buttonStyle} disabled={this.state.pastcurrentPage === 1}>Previous Page</button>
        <button onClick={this.pasthandleNextPage} style={buttonStyle} disabled={pastindexOfLastContest >= this.state.historyContests.length}>Next Page</button>

      </div>
    )
  }
}

export default withRouter(Contests);
