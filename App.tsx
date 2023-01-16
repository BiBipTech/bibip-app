import clsx from "clsx";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View } from "react-native";
import Router from "./Router";
import BiBipButton from "./src/components/buttons/BiBipButton/BiBipButton";
import { buttonStyles } from "./src/components/buttons/BiBipButton/common";

export default function App() {
  return <Router />;
}
