import React, {Component, PropTypes} from 'react'
import Input from '../../../common/forms/Input'
import './github.scss'

class GitHub extends Component {
  constructor(props) {
    super(props)
    this.state = {oauthToken: '', url: props.url}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({url: nextProps.url})
  }

  render() {
    const oauthTokenChanged = (evt) => this.setState({oauthToken: evt.target.value})
    const urlChanged = (evt) => this.setState({url: evt.target.value})
    const setUrl = () => this.props.gitHubSetUrl(this.state.url)
    const restore = () => this.props.restoreFromGitHub(this.state.url, this.state.oauthToken)

    return (
      <div className='import-github'>
        <fieldset className='gist-values'>
          <Input className='oauth-token' onChange={oauthTokenChanged} onBlur={oauthTokenChanged} value={this.state.oauthToken}>
            <span>oauth token</span>
          </Input>
          <Input className='gist-url' value={this.state.url} type='url' onChange={urlChanged} onBlur={setUrl}>
            <span>gist url</span>
          </Input>
        </fieldset>
        <button className='restore' onClick={restore}>import</button>
      </div>
    )
  }
}

GitHub.propTypes = {
  loaded: PropTypes.bool,
  restoreFromGitHub: PropTypes.func.isRequired,
  gitHubSetUrl: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired
}

export default GitHub