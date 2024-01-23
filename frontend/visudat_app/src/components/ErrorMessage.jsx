import React from "react";
import { Text } from "@radix-ui/themes";

const ErrorMessage = ({ message }) => {
  return (
    <Text size={"5"} color="red">
      {message}
    </Text>
  );
};

export default ErrorMessage;
