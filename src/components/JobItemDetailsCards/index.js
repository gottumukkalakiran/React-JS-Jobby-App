import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import FilterGroup from '../FilterGroup'
import ProfileCard from '../ProfileCard'
import JobItemCards from '../JobItemCards'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobItemDetailsCards extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
    checkedBoxes: [],
    salaryFilter: '',
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  formattedData = e => ({
    companyLogoUrl: e.company_logo_url,
    employment: e.employment_type,
    id: e.id,
    jobDescription: e.job_description,
    packagePerAnnum: e.package_per_annum,
    rating: e.rating,
    title: e.title,
    location: e.location,
  })

  getJobItemDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, checkedBoxes, salaryFilter} = this.state
    const text = checkedBoxes.join()
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${text}&minimum_package=${salaryFilter}&search=${searchInput}`
    console.log(apiUrl)
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.jobs.map(e => this.formattedData(e))
      this.setState({
        jobsList: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderProgressView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessJobView = () => {
    const {jobsList} = this.state
    if (jobsList.length > 0) {
      return (
        <ul className="jobs-list-order">
          {jobsList.map(e => (
            <JobItemCards key={e.id} item={e} />
          ))}
        </ul>
      )
    }
    return (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-products-img"
          alt="no jobs"
        />
        <h1 className="no-products-heading">No Jobs Found</h1>
        <p className="no-products-description">
          We could not find any Jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <div className="loader-container">
        <button
          type="button"
          className="logout-btn"
          onClick={this.getJobItemDetails}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessJobView()
      case apiStatusConstants.inProgress:
        return this.renderProgressView()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  onChangeSearchInput = e => {
    this.setState({
      searchInput: e.target.value,
    })
  }

  onSearchEnter = e => {
    if (e.key === 'Enter') {
      this.getJobItemDetails()
    }
  }

  onSearch = () => {
    this.getJobItemDetails()
  }

  updateCheckboxes = id => {
    this.setState(
      prev => ({
        checkedBoxes: [...prev.checkedBoxes, id],
      }),
      this.getJobItemDetails,
    )
  }

  updateSalary = id => {
    this.setState(
      {
        salaryFilter: id,
      },
      this.getJobItemDetails,
    )
  }

  render() {
    const {searchInput} = this.state
    const {salaryRangesList, employmentTypesList} = this.props
    return (
      <div className="job-card">
        <div className="side-bar">
          <ProfileCard />
          <hr className="line" />
          <FilterGroup
            salaryRangesList={salaryRangesList}
            employmentTypesList={employmentTypesList}
            selectedCheckBox={this.updateCheckboxes}
            updateSalary={this.updateSalary}
          />
        </div>

        <div className="results-container">
          <div className="search-container">
            <input
              type="search"
              className="search-bar"
              placeholder="Search"
              onChange={this.onChangeSearchInput}
              onKeyDown={this.onSearchEnter}
              value={searchInput}
            />
            <button
              type="button"
              onClick={this.onSearch}
              className="icon"
              testid="searchButton"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          {this.renderJobDetails()}
        </div>
      </div>
    )
  }
}

export default JobItemDetailsCards
