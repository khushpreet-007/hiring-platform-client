import React from 'react';
import axios from "axios";
import { withRouter, Link } from "react-router-dom";

const url = "http://localhost:4000/api";

class Problemset extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: this.props.location.state?.message,
      problems: [],

      currentPage: 1,
      problemsPerPage: 3, // Number of contests to display per page
    }
  }

  addTofavourites = async (evt) => {
    const { history } = this.props;
    try {
      // console.log(evt.target);
      const response = await axios.get(`${url}/problem/${evt.target.getAttribute("name")}/addToFavourites`, {
        withCredentials: true
      })
      // console.log(response);
      history.push("/problems", { message: response.data });
    }
    catch (err) {
      history.push("/problems", { message: err.response.data });
    }
  }

  async componentDidMount() {
    try {
      // console.log(this.props);
      setTimeout(() => {
        this.setState({ message: "" });
      }, 5000);
      const response = await axios.get(`${url}/problems`, {
        withCredentials: true
      });
      // console.log("hello");
      console.log(response);
      this.setState({ problems: response.data.problems });
    }
    catch (err) {
      const { history } = this.props;
      history.push("/login", { message: err.response.data });
    }

  }
  handlePrevPage = () => {
    this.setState(prevState => ({ currentPage: prevState.currentPage - 1 }));
  };

  handleNextPage = () => {
    this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
  };


  render() {
    // if (this.state.problems.length)
    // console.log(this.state.problems[0]._id);
    // console.log(this.state);

    const buttonStyle = {
      padding: '7px 15px',
      backgroundColor: '#007bff', // Blue color for the button
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      margin:'10px'
    };

    const indexOfLastProblem = this.state.currentPage * this.state.problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - this.state.problemsPerPage;
    const problem = this.state.problems.slice(indexOfFirstProblem, indexOfLastProblem);

    return (
      <div className='problemset'>
        {this.state.message ? (<div className='alert alert-primary'>{this.state.message}</div>) : ""}
        <h2 className='my-4 heading'>Practice Problems</h2>
        <table className='table'>
          <tbody>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Tags</th>
              <th>Add to favourites</th>
              <th>Submissions</th>
            </tr>
            {problem.map(problem => {
              return (
                <tr>
                  <td><Link to={`/problem/${problem._id}`}>{`${problem.contestID.number}${problem.code}`}</Link></td>
                  <td><Link to={`/problem/${problem._id}`}>{problem.name}</Link></td>
                  <td>{problem.tags.map(tag => {
                    return (<span className='badge text-bg-light'>{tag}</span>)
                  })}</td>
                  <td><i name={problem._id} onClick={this.addTofavourites} class="btn me-2 fa-solid fa-star" style={{ color: "#e6df1e" }}></i></td>
                  <td>{problem.submissions}</td>
                </tr>)
            })}</tbody>
        </table>

        <button onClick={this.handlePrevPage} style={buttonStyle} disabled={this.state.currentPage === 1}>Previous Page</button>
        <button onClick={this.handleNextPage} style={buttonStyle} disabled={indexOfLastProblem >= this.state.problems.length}>Next Page</button>

      </div>
    )
  }
}

export default withRouter(Problemset);
