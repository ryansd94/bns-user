import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./App.scss";
import Footer from "./components/shared/Footer";
import Navbar from "./components/shared/Navbar";
import Sidebar from "./components/shared/Sidebar";
import SettingsPanel from "./components/shared/SettingsPanel";
import { withTranslation } from "react-i18next";
import AppRoutes from "./AppRoutes";
import Progress from "react-progress-2";

function App() {
  state = {};
  useEffect(() => {
    if (this.props.location !== prevProps.location) {
      onRouteChanged();
      Progress.hide();
    }
  });

  const onRouteChanged = () => {
    Progress.show();
    const { i18n } = this.props;
    const body = document.querySelector("body");
    if (this.props.location.pathname === "/layout/RtlLayout") {
      body.classList.add("rtl");
      i18n.changeLanguage("ar");
    } else {
      body.classList.remove("rtl");
      i18n.changeLanguage("en");
    }
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ["/login"];
    for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
      if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
        this.setState({
          isFullPageLayout: true,
        });
        document
          .querySelector(".page-body-wrapper")
          .classList.add("full-page-wrapper");
        break;
      } else {
        this.setState({
          isFullPageLayout: false,
        });
        document
          .querySelector(".page-body-wrapper")
          .classList.remove("full-page-wrapper");
      }
    }
  };
  let navbarComponent = !this.state.isFullPageLayout ? <Navbar /> : "";
  let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar /> : "";
  let SettingsPanelComponent = !this.state.isFullPageLayout ? (
    <SettingsPanel />
  ) : (
    ""
  );
  let footerComponent = !this.state.isFullPageLayout ? <Footer /> : "";
  return (
    <div className="container-scroller">
      <Progress.Component />
      {navbarComponent}
      <div className="container-fluid page-body-wrapper">
        {sidebarComponent}
        <div className="main-panel">
          <div className="content-wrapper">
            <AppRoutes />
            {SettingsPanelComponent}
          </div>
          {footerComponent}
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(withRouter(App));
