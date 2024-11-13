import React, { Component, useState, useEffect, useRef } from "react"
import { Dropdown } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import { Trans } from "react-i18next"
import i18n from "../../i18n"
import { AvatarControl } from "components/avatar"
import { resetUserToken, getUserInfo } from "helpers"
import "firebase/compat/auth"
import _ from "lodash"
import BreadCrumb from "./breadCrumb"
import { setLang } from "stores/views/master"
import { setNotifyData } from "stores/components/notify"
import { useDispatch } from "react-redux"
import { Notify } from "components/notify"
import { get } from "services"
import axios from "axios"
import { baseUrl } from "configs"
import { logOut } from "firebase"

function MyComponent() {
  const [languageIcon, setLanguageIcon] = useState("flag-icon flag-icon-gb")
  const [language, setLanguage] = useState("English")
  const history = useHistory()
  const user = getUserInfo()
  const dispatch = useDispatch()
  const cancelToken = useRef(null)
  const lengthRowNotify = 20

  function toggleOffcanvas() {
    document.querySelector(".sidebar-offcanvas").classList.toggle("active")
  }

  useEffect(() => {
    i18n.changeLanguage("en")
    cancelToken.current = new axios.CancelToken.source()

    const getNotifies = async () => {
      await get(
        baseUrl.jm_notifyUser,
        {
          start: 0,
          length: lengthRowNotify,
        },
        cancelToken,
      ).then((data) => {
        const notifyData = {
          ...data.data,
          total: data.recordsTotal,
          currentPage: 2,
        }
        dispatch(setNotifyData(notifyData))
      })
    }

    getNotifies()

    return () => {
      if (cancelToken.current) {
        cancelToken.current.cancel()
      }
    }
  }, [])

  const changeLanguage = (lng) => {
    if (lng === "vi") {
      setLanguageIcon("flag-icon flag-icon-vn")
      setLanguage("Vietnamese")
    } else {
      setLanguageIcon("flag-icon flag-icon-gb")
      setLanguage("English")
    }
    i18n.changeLanguage(lng)
    dispatch(setLang(lng))
  }

  const onLogOut = () => {
    resetUserToken()
    logOut()
    history.push("/login")
  }

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo" to="/">
          <img src={require("../../assets/images/logo.svg")} alt="logo" />
        </Link>
        <Link className="navbar-brand brand-logo-mini" to="/">
          <img src={require("../../assets/images/logo-mini.svg")} alt="logo" />
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          onClick={() => document.body.classList.toggle("sidebar-icon-only")}
        >
          <span className="mdi mdi-menu"></span>
        </button>
        <BreadCrumb />
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item nav-profile nav-language d-none d-lg-flex">
            <Dropdown alignRight>
              <Dropdown.Toggle className="nav-link count-indicator">
                <div className="nav-language-icon">
                  <i className={languageIcon} title="us" id="us"></i>
                </div>
                <div className="nav-language-text">
                  <p className="mb-1 text-black">
                    <Trans>{language}</Trans>
                  </p>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="preview-list navbar-dropdown">
                <Dropdown.Item
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => changeLanguage("vi")}
                >
                  <div className="nav-language-icon mr-2">
                    <i
                      className="flag-icon flag-icon-vn"
                      title="vn"
                      id="vn"
                    ></i>
                  </div>
                  <div className="nav-language-text">
                    <p className="mb-1 text-black">
                      <Trans>Vietnamese</Trans>
                    </p>
                  </div>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => changeLanguage("en")}
                >
                  <div className="nav-language-icon mr-2">
                    <i
                      className="flag-icon flag-icon-gb"
                      title="GB"
                      id="gb"
                    ></i>
                  </div>
                  <div className="nav-language-text">
                    <p className="mb-1 text-black">
                      <Trans>English</Trans>
                    </p>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="nav-item">
            <Notify user={user} />
          </li>
          <li className="nav-item nav-profile nav-language">
            <Dropdown alignRight>
              <Dropdown.Toggle className="nav-link count-indicator">
                <AvatarControl name={user?.fullName} image={user?.image} />
                <div className="nav-profile-text">
                  <p className="mb-1 text-black">
                    <Trans>{user?.fullName}</Trans>
                  </p>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="preview-list navbar-dropdown">
                <div className="p-3 text-center bg-primary">
                  <img
                    className="img-avatar img-avatar48 img-avatar-thumb"
                    src={require("../../assets/images/faces/face28.png")}
                    alt=""
                  />
                </div>
                <div className="p-2">
                  <h5 className="dropdown-header text-uppercase pl-2 text-dark">
                    <Trans>User Options</Trans>
                  </h5>
                  <Dropdown.Item
                    className="dropdown-item d-flex align-items-center justify-content-between"
                    href="!#"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <span>
                      <Trans>Inbox</Trans>
                    </span>
                    <span className="p-0">
                      <span className="badge badge-primary">3</span>
                      <i className="mdi mdi-email-open-outline ml-1"></i>
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item d-flex align-items-center justify-content-between"
                    href="!#"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <span>
                      <Trans>Profile</Trans>
                    </span>
                    <span className="p-0">
                      <span className="badge badge-success">1</span>
                      <i className="mdi mdi-account-outline ml-1"></i>
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item d-flex align-items-center justify-content-between"
                    href="!#"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <span>
                      <Trans>Settings</Trans>
                    </span>
                    <i className="mdi mdi-settings"></i>
                  </Dropdown.Item>
                  <div role="separator" className="dropdown-divider"></div>
                  <h5 className="dropdown-header text-uppercase  pl-2 text-dark mt-2">
                    <Trans>Actions</Trans>
                  </h5>
                  <Dropdown.Item
                    className="dropdown-item d-flex align-items-center justify-content-between"
                    href="!#"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <span>
                      <Trans>Lock Account</Trans>
                    </span>
                    <i className="mdi mdi-lock ml-1"></i>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={onLogOut}
                    className="dropdown-item d-flex align-items-center justify-content-between"
                  >
                    <span>
                      <Trans>Log Out</Trans>
                    </span>
                    <i className="mdi mdi-logout ml-1"></i>
                  </Dropdown.Item>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          onClick={toggleOffcanvas}
        >
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  )
}

class Navbar extends Component {
  render() {
    return <MyComponent></MyComponent>
  }
}

export default Navbar
