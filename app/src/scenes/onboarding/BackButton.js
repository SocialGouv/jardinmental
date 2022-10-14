import React from "react";
import BackButton from "../../components/BackButton";
import { useOnboardingProgressHeader } from "./ProgressHeader";

export const OnboardingBackButton = ({ ...props }) => {
  const { isVisible } = useOnboardingProgressHeader();

  if (isVisible) return null;
  return <BackButton {...props} />;
};
