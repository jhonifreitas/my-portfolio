import React from 'react'
import ReactWOW from 'react-wow'
import './styles.scss'
import Slider from "react-slick";
import { translate, Trans } from 'react-i18next'

import Title from '../Title'
import Button from '../Button'

class Item extends React.Component {

  render(){
    let type = this.props.value.type
    let icon = 'fas fa-desktop'
    let time = this.props.delay ? this.props.delay/10 : 0
    const delay = time+'s'

    if (this.props.lng === 'pt-BR' || this.props.lng === 'pt') {
      if (this.props.value.type === 'mobile') {type = 'aplicativo'; icon = 'fas fa-mobile-alt'}
      else if (this.props.value.type === 'website') {type = 'site'}
      else if (this.props.value.type === 'e-commerce') {type = 'site de vendas'; icon = 'fas fa-shopping-cart'}
      else if(this.props.value.type === 'system'){type = 'sistema'; icon = 'fas fa-laptop-code'}
    }

    const options = {
      dots: false,
      arrows: false,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 5000,
    }

    return (
      <ReactWOW animation="pulse" delay={delay}>
        <div className="col-md-3 col-sm-4 col-6 mb-4">
          <div className="project h-100" data-toggle="modal" data-target={"#project-"+this.props.delay}>
            <div className="image-info position-relative h-100">
              <img src={ this.props.value.featured_image.url } className="w-100" alt={ this.props.value.name } title={ this.props.value.name } />
              <div className="info text-light px-4 py-3">
                <i className={icon+" h5 mb-0 mr-2"}></i>
                <span className="text-capitalize">{type}</span>
                <h4 className="font-weight-bold mb-0">{ this.props.value.name }</h4>
              </div>
            </div>
          </div>
          <div className="modal fade" id={"project-"+this.props.delay} tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content rounded-0">
                <div className="modal-body">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <button type="button" className="close d-md-none" data-dismiss="modal" aria-label="Close">
                        <i aria-hidden="true" className="fas fa-times text-dark"></i>
                      </button>
                      <Slider {...options}>
                        { this.props.value.images.map((value, key) =>
                          <div key={key} className="item">
                            <img src={ value.url } className="img-fluid mx-auto" alt={ this.props.value.name } title={ this.props.value.name } />
                          </div>
                        )}
                      </Slider>
                    </div>
                    <div className="col-md-8">
                      <div className="all-info py-3">
                        <div className="d-md-flex align-items-center justify-content-between">
                          <h2 className="font-weight-bold">{ this.props.value.name }</h2>
                          { this.props.value.link &&
                            <Button link={this.props.value.link} className="btn-dark px-3 py-1 mb-3 mb-md-0">Acesse</Button>
                          }
                        </div>
                        <h4 className="text-capitalize"><i className={icon+" h5 mb-0 mr-2"}></i>{type}</h4>
                        { this.props.value.company && <h4><Trans i18nKey='Portfolio.company'></Trans>: <a href={this.props.value.company.link} className="text-dark" target="_blank">{this.props.value.company.name}</a></h4> }
                        <div className="mt-4">
                          <pre className="h6">{ this.props.lng === 'pt-BR' || this.props.lng === 'pt' ? this.props.value.description_PT : this.props.value.description_EN }</pre>
                        </div>
                        { this.props.value.skills.length > 0 &&
                          <div>
                            <h6><Trans i18nKey='Portfolio.technologies'></Trans></h6>
                            <ul className="list-inline mb-0">
                              { this.props.value.skills.map((value, key) =>
                                <li key={key} className="list-inline-item font-weight-bold"><i className="fas fa-check mr-2"></i>{value.name}</li>
                              )}
                            </ul>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ReactWOW>
    )
  }
}

class Counter extends React.Component {

  render(){
    let time = this.props.delay ? this.props.delay/10 : 0
    const delay = time+'s'
    return (
      <ReactWOW animation="fadeIn" delay={delay}>
        <div className="col-md-4 col-sm-6 col-12 text-center">
          <h1 className="text-light font-weight-normal">{ this.props.number }</h1>
          <h3 className="text-light mb-4">{ this.props.title }</h3>
        </div>
      </ReactWOW>
    )
  }
}

class Portfolio extends React.Component {

  state = {
    projects: [],
    total_projects: 0,
    total_projects_all: 0,
    total_companys: 0,
    limit: 8,
    active: null
  };

  componentDidMount() {
    this.loadProjects()
    this.callApi(process.env.REACT_APP_API_URL+'/project/count')
      .then(res => this.setState({ total_projects_all: res }))
      .catch(err => console.log(err));
    this.callApi(process.env.REACT_APP_API_URL+'/company/count')
      .then(res => this.setState({ total_companys: res }))
      .catch(err => console.log(err));
  }

  callApi = async (url) => {
    const response = await fetch(url);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  loadProjects(){
    let sort_type = ''
    let sort_limit = '_limit='+this.state.limit
    if(this.state.active){
      sort_type = '&type_contains='+this.state.active
    }
    this.callApi(process.env.REACT_APP_API_URL+'/project?'+sort_limit+sort_type+'&_sort=createdAt:desc')
      .then(res => {
        this.setState({ projects: res, limit: this.state.limit+8 })
      })
      .catch(err => console.log(err));
    this.callApi(process.env.REACT_APP_API_URL+'/project/count?'+sort_limit+sort_type)
      .then(res => this.setState({ total_projects: res }))
      .catch(err => console.log(err));
  }

  onFilterChange(filter){
    this.setState({ active: filter, limit: 8}, () => this.loadProjects());
  }

  render() {
    return (
      <section id="Portfolio" className="pt-8">
        <div className="container">
          <ReactWOW animation="fadeIn" delay=".2s">
            <div className="row mb-5">
              <div className="col-md-12">
                <Title text={ this.props.t('Portfolio.title') } />
              </div>
            </div>
          </ReactWOW>
          <div className="row filter justify-content-center mb-5">
            <ReactWOW animation="fadeIn" delay=".2s">
              <div className="col-12 text-center mb-2 mb-md-0 col-md-auto">
                <Button className={`px-45 btn-outline-dark ${!this.state.active ? 'active': ''}`} onClick={() => this.onFilterChange()}>{ this.props.t('Portfolio.all') }</Button>
              </div>
            </ReactWOW>
            <ReactWOW animation="fadeIn" delay=".3s">
              <div className="col-12 text-center mb-2 mb-md-0 col-md-auto">
                <Button className={`px-45 btn-outline-dark ${this.state.active === "website" ? 'active': ''}`} onClick={() => this.onFilterChange('website')}>{ this.props.t('Portfolio.websites') }</Button>
              </div>
            </ReactWOW>
            <ReactWOW animation="fadeIn" delay=".4s">
              <div className="col-12 text-center mb-2 mb-md-0 col-md-auto">
                <Button className={`px-45 btn-outline-dark ${this.state.active === "mobile" ? 'active': ''}`} onClick={() => this.onFilterChange('mobile')} >{ this.props.t('Portfolio.apps') }</Button>
              </div>
            </ReactWOW>
            <ReactWOW animation="fadeIn" delay=".5s">
              <div className="col-12 text-center mb-2 mb-md-0 col-md-auto">
                <Button className={`px-45 btn-outline-dark ${this.state.active === "e-commerce" ? 'active': ''}`} onClick={() => this.onFilterChange('e-commerce')} >{ this.props.t('Portfolio.ecommerces') }</Button>
              </div>
            </ReactWOW>
            <ReactWOW animation="fadeIn" delay=".6s">
              <div className="col-12 text-center mb-2 mb-md-0 col-md-auto">
                <Button className={`px-45 btn-outline-dark ${this.state.active === "system" ? 'active': ''}`} onClick={() => this.onFilterChange('system')} >{ this.props.t('Portfolio.systems') }</Button>
              </div>
            </ReactWOW>
          </div>
          <div className="row grid">
            { this.state.projects.map((value, key) => <Item key={key} delay={key} value={value} lng={this.props.lng} />)}
          </div>
          { this.state.projects.length < this.state.total_projects &&
            <div className="row mt-5">
              <div className="col-md-12 text-center">
                <Button className="px-45 btn-outline-dark" onClick={() => this.loadProjects()}>{ this.props.t('Portfolio.button') }</Button>
              </div>
            </div>
          }
        </div>
        <div id="Counter">
          <div className="container">
            <div className="row">
              <Counter number={this.props.years_experience} title={ this.props.t('Portfolio.year_experience') } delay={2}/>
              <Counter number={this.state.total_projects_all} title={ this.props.t('Portfolio.projects_delivered') } delay={1}/>
              <Counter number={this.state.total_companys} title={ this.props.t('Portfolio.companys') } delay={0}/>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default translate('common')(Portfolio)
