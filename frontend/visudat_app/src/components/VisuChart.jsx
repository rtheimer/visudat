import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiBaseUrl, apiPort, apiProtocol } from "./VisudatConfig";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
  TimeSeriesScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
  TimeSeriesScale
);
ChartJS.defaults.borderColor = "rgba(63,75,118,0.4)";

const VisuChart = (props) => {
  const [labels, setLabels] = useState([]);
  const [dataset, setDataset] = useState([]);

  let p = props.c;
  let period = props.pvDataPeriod;
  const selectedDate = props.selectedDate;
  console.log(selectedDate);

  useEffect(() => {
    let url = "";
    console.log(period);
    switch (period) {
      case "total":
        url = period;
        break;
      case "year":
        url = selectedDate.getFullYear() + "/" + period;
        break;
      case "month":
        let month = selectedDate.getMonth() + 1;
        let year = selectedDate.getFullYear();
        url = month + "/" + year + "/" + period;
        break;
    }
    axios
      .get(
        apiProtocol +
          "//" +
          apiBaseUrl +
          (apiPort !== 80 ? ":" + apiPort : "") +
          "/api/" +
          p[1] +
          "/" +
          url
      )
      .then((response) => {
        const responseData = JSON.parse(response.data);
        setLabels(responseData.labels);
        setDataset(responseData.data);
      })
      .catch((error) => console.error(error));
  }, [p, period, selectedDate]);

  let rgbaColor = "rgba(63,75,118,0.4)";
  const options = {
    responsive: true,
    borderRadius: 3,
    barPercentage: 0.75,
    scales: {
      y: { title: { text: "PV Leistung in kw/h", display: true } },
    },
    plugins: {
      title: {
        display: true,
        text: p[0],
        color: "gray",
        font: {
          size: 30,
        },
      },
    },
  };
  console.log(labels);
  const data = {
    labels,
    datasets: [
      {
        label: "Year Production kw/h",
        data: dataset,
        backgroundColor: [rgbaColor],
        borderColor: "#3f4b76",
        borderWidth: 2,
        hoverBackgroundColor: "#3f4b76",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};
export default VisuChart;
