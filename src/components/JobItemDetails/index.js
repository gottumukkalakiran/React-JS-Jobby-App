import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    apiStatus: apiStatusConstants.initial,
    similarProductsData: [],
  }

  componentDidMount() {
    this.getJobCardDetails()
  }

  formattedData = e => ({
    companyLogoUrl: e.company_logo_url,
    companyWebsiteUrl: e.company_website_url,
    employmentType: e.employment_type,
    skills: e.skills,
    id: e.id,
    jobDescription: e.job_description,
    packagePerAnnum: e.package_per_annum,
    rating: e.rating,
    title: e.title,
    location: e.location,
    lifeAtCompany: e.life_at_company,
  })

  getFormattedData = e => ({
    companyLogoUrl: e.company_logo_url,
    employmentType: e.employment_type,
    id: e.id,
    jobDescription: e.job_description,
    rating: e.rating,
    title: e.title,
    location: e.location,
  })

  getJobCardDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.formattedData(data.job_details)
      const updatedSimilarProductsData = data.similar_jobs.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        jobDetails: updatedData,
        apiStatus: apiStatusConstants.success,
        similarProductsData: updatedSimilarProductsData,
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
    const {jobDetails, similarProductsData} = this.state
    const item = jobDetails
    return (
      <>
        <div className="item-details">
          <div className="jobs-list-order">
            <div className="job-item-card">
              <div className="company-container">
                <img
                  className="companyLogo"
                  src={item.companyLogoUrl}
                  alt="job details company logo"
                />
                <div>
                  <h1 className="company-title">{item.title}</h1>
                  <div className="company-container">
                    <BsFillStarFill className="star" />
                    <p className="rating">{item.rating}</p>
                  </div>
                </div>
              </div>
              <div className="company-info">
                <div className="company-details">
                  <MdLocationOn className="location" />
                  <p className="place">{item.location}</p>
                  <BsBriefcaseFill className="type-icon" />
                  <p className="place">{item.employmentType}</p>
                </div>
                <p className="salary">{item.packagePerAnnum}</p>
              </div>
              <hr className="line1" />
              <div>
                <div className="website-link">
                  <h1 className="job-description1">Description</h1>
                  <a
                    className="website-link2"
                    href={item.companyWebsiteUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="website">Visit</span>
                    <FaExternalLinkAlt />
                  </a>
                </div>
                <p className="job-description-text">{item.jobDescription}</p>
              </div>
              <div>
                <h1 className="job-description2">Skills</h1>
                <ul className="skill-container">
                  {item.skills.map(e => (
                    <li key={e.name} className="skill-card">
                      <img src={e.image_url} alt={e.name} />
                      <p className="job-description-text1">{e.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h1 className="job-description2">Life at Company</h1>
                <div className="office">
                  <p className="job-description-text3">
                    {item.lifeAtCompany.description}
                  </p>
                  <img
                    className="company-building"
                    src={item.lifeAtCompany.image_url}
                    alt="life at company"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="similar-container">
          <h1 className="similar-products-heading">Similar Jobs</h1>
          <ul className="similar-products-list">
            {similarProductsData.map(eachSimilarProduct => (
              <SimilarJobItem
                productDetails={eachSimilarProduct}
                key={eachSimilarProduct.id}
              />
            ))}
          </ul>
        </div>
      </>
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
          onClick={this.getJobCardDetails}
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

  render() {
    return (
      <div className="Job-container">
        <Header />
        <div className="job-card-details-container">
          {this.renderJobDetails()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
