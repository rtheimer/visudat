import { Flex, Text, Strong } from "@radix-ui/themes";
//import { ThemeProvider } from '@radix-ui/react-theme';

function NavbarFixed(props) {
  return (
    <Flex
      width={"100%"}
      justify={"between"}
      p="5"
      height={"min-content"}
      style={{
        backgroundColor: "var(--accent-a11)",
        color: "var(--indigo-2)",
      }}
    >
      <Text as="p" size={"6"}>
        <Strong>VISUDAT Enterprise</Strong>
      </Text>
      <Text as="p" size={"6"}>
        <Strong>{props.title}</Strong>
      </Text>
      <Text as="p" size={"4"}>
        <Strong>PV data, simplified</Strong>
      </Text>
    </Flex>
  );
}
export default NavbarFixed;
