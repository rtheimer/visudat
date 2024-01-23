import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

const ChartComponent = (props) => {
  const [data, setData] = useState([]);
  let p = props.c;

  useEffect(() => {
    axios
      .get("http://192.168.1.107:8000/4/total/")
      .then((response) => {
        console.log(response);
        const newData = Object.keys(response.data.year).map((key) => ({
          label: response.data.year[key],
          value: response.data.produced_year[key],
        }));
        setData(newData);
        // Log the fetched data
        console.log("Fetched Data:", newData);
      })
      .catch((error) => console.error(error));
  }, [p]);

  useEffect(() => {
    let rgbaColor = "rgba(247,107,21,0.4)"; //rgba(244,44,27,0.4)

    const ctx = document.getElementById("myChart").getContext("2d");
    const newChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((item) => item.label),
        datasets: [
          {
            label: "Year",
            data: data.map((item) => item.value / 1000),
            backgroundColor: [rgbaColor],
            borderColor: "#f76b15",
            borderWidth: 2,
            hoverBackgroundColor: "#f76b15",
          },
        ],
      },

      options: {
        borderRadius: 3,
        plugins: {
          title: {
            display: true,
            text: "Custom Chart Title",
          },
        },
      },
      responsive: true,
    });

    return () => {
      newChartInstance.destroy();
    };
  }, [data]);

  return (
    <div className="flex-auto relative">
      <canvas id="myChart" className="w-full mw-[600px]"></canvas>
    </div>
  );
};

export default ChartComponent;
