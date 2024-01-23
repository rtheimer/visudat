import { Tabs, Box, Text } from "@radix-ui/themes";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

const NavbarDashboard = ({
  pvDataPeriod,
  setPvDataPeriod,
  selectedDate,
  setSelectedDate,
}) => {
  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);

  return (
    <Tabs.Root defaultValue={pvDataPeriod}>
      <Tabs.List size={"2"} style={{ color: "var(--accent-a2)" }}>
        <Tabs.Trigger onClick={() => setPvDataPeriod("day")} value="day">
          Tag
        </Tabs.Trigger>
        <Tabs.Trigger onClick={() => setPvDataPeriod("month")} value="month">
          Monat
        </Tabs.Trigger>
        <Tabs.Trigger onClick={() => setPvDataPeriod("year")} value="year">
          Jahr
        </Tabs.Trigger>
        <Tabs.Trigger onClick={() => setPvDataPeriod("total")} value="total">
          Gesamt
        </Tabs.Trigger>
      </Tabs.List>
      <Box p={"2"}>
        <Tabs.Content value="day">
          <DatePicker
            className="custom-datepicker"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showYearDropdown
            showMonthDropdown
            dateFormat="dd.MM.yyyy"
            todayButton="Today"
            dropdownMode="select"
          />
        </Tabs.Content>
        <Tabs.Content value="month">
          <DatePicker
            className="custom-datepicker"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM.yyyy"
            todayButton="Today"
            showMonthYearPicker
          />
        </Tabs.Content>
        <Tabs.Content value="year">
          <DatePicker
            className="custom-datepicker"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showYearPicker
            todayButton="Today"
            dateFormat="yyyy"
          />
        </Tabs.Content>
        <Tabs.Content value="total"></Tabs.Content>
      </Box>
    </Tabs.Root>
  );
};

export default NavbarDashboard;
