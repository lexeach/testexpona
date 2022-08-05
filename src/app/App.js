import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { withTranslation } from "react-i18next";

class App extends Component {
  state = {}
  // componentDidMount() {
  //   this.onRouteChanged();
  // }
  render () {
    let navbarComponent = !this.state.isFullPageLayout ? <Navbar/> : '';
    let footerComponent = !this.state.isFullPageLayout ? <Footer/> : '';
    return (
      <div className="container-scroller ">
        {/* { sidebarComponent } */}
        <div className="container-fluid page-body-wrapper">
          { navbarComponent }
          <div className="main-panel ">
            <div className="content-wrapper">
              <AppRoutes/>
            </div>
            { footerComponent }
          </div>
        </div>
      </div>
    );
  }



  // onRouteChanged() {
  //   console.log("ROUTE CHANGED");
  //   const { i18n } = this.props;
  //   const body = document.querySelector('body');
   
   
  // }

}

export default withTranslation()(withRouter(App));
