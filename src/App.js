import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here

const apiConstents = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class App extends Component {
  state = {
    defaultOption: categoriesList[0].id,
    apiStatus: apiConstents.initial,
    dataList: [],
  }

  componentDidMount() {
    this.getCourses()
  }

  getCourses = async () => {
    this.setState({apiStatus: apiConstents.inProgress})
    const {defaultOption} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${defaultOption}`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data.projects)
    if (response.ok === true) {
      this.setState({dataList: data.projects, apiStatus: apiConstents.success})
    } else {
      this.setState({apiStatus: apiConstents.failure})
    }
  }

  onSelectOption = event => {
    console.log(event.target.value)
    this.setState({defaultOption: event.target.value}, this.getCourses)
  }

  renderListCard = () => {
    const {dataList} = this.state
    console.log(dataList)

    return (
      <div className="list-card">
        <ul className="ul-card">
          {dataList.map(eachItem => (
            <li className="list-item" key={eachItem.id}>
              <img src={eachItem.image_url} alt={eachItem.name} />
              <p>{eachItem.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <>
      <div className="loader-container1" data-testid="loader">
        <Loader type="ThreeDots" color="#bfbfbf" height="50" width="50" />
      </div>
    </>
  )

  onClickRetryBtn = () => {
    this.getCourses()
  }

  renderFailureView = () => (
    <div>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
      </div>
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderSwitchView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstents.inProgress:
        return this.renderLoadingView()
      case apiConstents.success:
        return this.renderListCard()
      case apiConstents.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    // const {defaultOption} = this.state
    return (
      <div className="main-card">
        <nav className="nav-card">
          <img
            className="img-card"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="option-card">
          <select className="select" onClick={this.onSelectOption}>
            {categoriesList.map(eachOption => (
              <option key={eachOption.id} value={eachOption.id}>
                {eachOption.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.renderSwitchView()}
      </div>
    )
  }
}

export default App
