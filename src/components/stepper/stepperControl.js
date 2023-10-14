import React, { useState, useEffect } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import ButtonDetail from "components/button/ButtonDetail";
import _ from "lodash";

const StepperControl = (props) => {
  const { steps, renderSteps, handleSubmit, errors, id } = props;
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const renderTabContent = (index) => {
    return renderSteps[index];
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onNextStep = (result) => {
    if (result === true) {
      handleNextStep();
    }
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNextStep = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  return (
    <Grid container gap={2} direction="column">
      <Grid item>
        <Stepper activeStep={activeStep}>
          {steps.map((item, index) => (
            <Step key={item.label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {item.label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Grid>
      <Grid item>
        <React.Fragment>
          {renderTabContent(activeStep)}
          {activeStep !== 2 ? (
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />

              <ButtonDetail
                isFloatRight={true}
                id={id}
                label={activeStep == 0 ? t("Next") : t("Finish")}
                disabled={!_.isEmpty(errors) ? true : false}
                onClick={async () => onNextStep(await handleSubmit(activeStep))}
                sx={{ mr: 1 }}
              />
              {/* <Button disabled={!_.isEmpty(errors) ? true : false} onClick={async () => onNextStep(await handleSubmit(activeStep))} sx={{ mr: 1 }}>
                            {activeStep == 0 ? t('Next') : t('Finish')}
                        </Button> */}
            </Box>
          ) : (
            ""
          )}
        </React.Fragment>
      </Grid>
    </Grid>
  );
};

export default StepperControl;
