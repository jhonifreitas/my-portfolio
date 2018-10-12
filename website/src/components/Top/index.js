import React from 'react'
import './styles.scss'
import { translate } from 'react-i18next'
import { Link } from 'react-scroll'

import Button from '../Button'
import Social from '../Social'

class Top extends React.Component {

  state = {
    response: null
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/profile?active=true');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    const mobile = (window.innerWidth < 992) ? true : false
    if (this.state.response) {
      console.log(this.state.response[0])
    }
    return (
      <section id="Top">
        <div className="container">

          <div className="box-left d-none d-md-block"></div>
          <div className="box-right d-none d-md-block"></div>

          <div className="row">
            <div className="col-md-6 align-self-center">
              <div className="px-3">
                <div className="text-center d-md-none mb-3">
                  <img src="/assets/images/photo.png" className="rounded-circle w-50" alt="" title="Photo" />
                </div>
                <h1 className="mb-0 font-weight-bold">Jonathan Freitas</h1>
                <h4 className="font-weight-normal">{ this.props.t('Top.my_job') }</h4>

                <div className="mt-4">
                  <Button className={`mr-3 px-4 btn-dark ${(mobile) ? 'w-100 mb-2' : ''}`} link="#">{ this.props.t('Top.hire_me') }</Button>
                  <Link className={`btn rounded-0 text-uppercase font-weight-semi-bold px-4 btn-outline-dark ${(mobile) ? 'w-100' : ''}`}
                        to="About"
                        smooth={true}
                        duration={900}
                  >
                    { this.props.t('Top.explore_more') }
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6 align-self-center text-center d-none d-md-block">
              <img src="/assets/images/photo.png" className="rounded-circle w-25" alt="" title="Photo" />
              <h3 className="font-weight-bold my-2">{ this.props.t('Top.contact') }</h3>
              <Social />
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default translate('common')(Top)
