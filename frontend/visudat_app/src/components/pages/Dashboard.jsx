import { Flex, Box, Text, Strong } from "@radix-ui/themes";
import NavbarFixed from "../NavbarFixed";
import MyList from "../SortableList";
import NavbarDashboard from "../NavbarDashboard";
import OptionsMenu from "../OptionsMenu";
import VisuChart from "../VisuChart";
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [content, setContent] = useState([""]);
  const [pvDataPeriod, setPvDataPeriod] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    console.log(selectedDate);
    // Add additional logs or checks here if needed
  }, [selectedDate]);

  return (
    <Flex height={"100%"} direction={"column"}>
      <NavbarFixed title="Dashboard" />

      <Flex
        height={"100%"}
        gap={"3"}
        px={"5"}
        py={"5"}
        wrap={"wrap"}
        style={{ overflowY: "auto" }}
      >
        <Box
          style={{
            backgroundColor: "",
            flexGrow: "1",
          }}
        >
          <Text as="p" size="5" color="gray">
            <Strong>PV Anlagen</Strong>
          </Text>
          <MyList setContent={setContent} />
        </Box>
        <Box
          style={{
            flexGrow: "5",
          }}
        >
          <Flex justify={"between"}>
            <NavbarDashboard
              pvDataPeriod={pvDataPeriod}
              setPvDataPeriod={setPvDataPeriod}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <OptionsMenu />
          </Flex>
          <Box style={{ height: "80%" }}>
            <VisuChart
              c={content}
              pvDataPeriod={pvDataPeriod}
              selectedDate={selectedDate}
            />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
