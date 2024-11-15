﻿import React, { useState, useEffect } from "react"
import Button from "@mui/material/Button"
import { useTranslation } from "react-i18next"
import PropTypes from "prop-types"
import { IconSave, IconCancel } from "components/icon/icon"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { EColor, EButtonDetailType } from "configs"
import IconButton from "@mui/material/IconButton"
import { SpinningCircles } from "react-loading-icons"
import { useSelector } from "react-redux"
import Grid from "@mui/material/Grid"
import eventEmitter from "helpers/eventEmitter"
import _ from "lodash"

const ButtonDetail = (props) => {
  const theme = createTheme({
    palette: {
      neutral: {
        main: EColor.cancel,
        contrastText: "#fff",
      },
    },
  })
  const { t } = useTranslation()
  const {
    type,
    onClick,
    autoFocus,
    disabled,
    className,
    isFloatRight = false,
    label,
    id,
  } = props
  const [icon, setIcon] = useState("")
  const [text, setText] = useState(!_.isEmpty(label) ? label : '')
  const [disabledButton, setDisabledButton] = useState(disabled)
  const [color, setColor] = useState(null)
  const [defaultLoading, setDefaultLoading] = useState(false)
  const [loading, setLoading] = useState(
    useSelector((state) => state.button.loading),
  )
  const lang = useSelector((state) => state.master.lang)

  useEffect(() => {
    switch (type) {
      case EButtonDetailType.save:
        setIcon(<IconSave />)
        _.isEmpty(text) ? setText(t("Save")) : ''
        setDefaultLoading(true)
        break
      case EButtonDetailType.ok:
        setIcon(<IconSave />)
        setText(t("Ok"))
        break
      case EButtonDetailType.undo:
        setIcon(<IconCancel></IconCancel>)
        setText(t("Cancel"))
        setColor("neutral")
        break
      case EButtonDetailType.accept:
        setIcon(<IconSave />)
        setText(t("Confirm"))
        setDefaultLoading(true)
        break
      default:
        setDefaultLoading(true)
        break
    }
  }, [lang])

  useEffect(() => {
    setDisabledButton(disabled)
  }, [disabled])

  const onChangeButtonDisabled = ({ buttonId, disabled }) => {
    if (id === buttonId) {
      setDisabledButton(disabled)
    }
  }

  const onChangeButtonLoading = ({ buttonId, loading }) => {
    if (id === buttonId) {
      setLoading(loading)
    }
  }

  useEffect(() => {
    eventEmitter.on("onChangeButtonDisabled", onChangeButtonDisabled)
    eventEmitter.on("onChangeButtonLoading", onChangeButtonLoading)

    return () => {
      eventEmitter.off("onChangeButtonDisabled")
      eventEmitter.off("onChangeButtonLoading")
    }
  }, [])

  let button
  if (type != "Undo") {
    const themeButton = (
      <Button
        onClick={onClick}
        color={color != null ? color : "primary"}
        autoFocus={autoFocus}
        variant="contained"
        disabled={(defaultLoading ? loading : false) || disabledButton}
        className={`${className} ${isFloatRight == true ? "f-right" : ""}`}
      >
        {text}
      </Button>
    )
    button =
      defaultLoading && loading ? (
        <Grid
          item
          xs
          container
          justifyContent={isFloatRight ? "flex-end" : "flex-start"}
          direction={"row"}
          alignItems="center"
        >
          <Grid item>
            <IconButton
              className="icon-loading-container"
              hidden={!loading}
              style={{ padding: 0 }}
              aria-label="delete"
            >
              <SpinningCircles
                speed={1}
                width={24}
                height={24}
                fill="#1976d2"
                stroke="#1976d2"
              />
            </IconButton>
          </Grid>
          <Grid item>{themeButton}</Grid>
        </Grid>
      ) : (
        themeButton
      )
  } else {
    button = (
      <ThemeProvider theme={theme}>
        <Button
          onClick={onClick}
          color={color != null ? color : "primary"}
          autoFocus={autoFocus}
          className={`${className} button-detail`}
          disabled={disabledButton}
          variant="outlined"
        >
          {text}
        </Button>
      </ThemeProvider>
    )
  }
  return button
}
ButtonDetail.propTypes = {
  onClick: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
}
ButtonDetail.defaultProps = {
  disabled: false,
}
export default ButtonDetail
