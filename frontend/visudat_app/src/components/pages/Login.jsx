import { Flex } from "@radix-ui/themes";
import LoginForm from "../LoginForm";
import NavbarFixed from "../NavbarFixed";

function LoginPage() {
  return (
    <Flex height={"100%"} style={{ flexDirection: "column" }}>
      <NavbarFixed />
      <LoginForm />
    </Flex>
  );
}

export default LoginPage;
