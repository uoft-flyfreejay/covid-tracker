import React, { useState, useEffect } from "react";
import "./App.css";
import Select from "react-select";
import Card from "./SummaryCard";
import { Link } from 'react-router-dom';
// Import other necessary components and CSS

function MainPage() {
    //App component starts here
    const locationList = [
      { value: "all", label: "All Provinces" },
      { value: "AB", label: "Alberta" },
      { value: "BC", label: "British Columbia" },
      { value: "MB", label: "Manitoba" },
      { value: "NB", label: "New Brunswick" },
      { value: "NL", label: "Newfoundland and Labrador" },
      { value: "NT", label: "Northwest Territories" },
      { value: "NS", label: "Nova Scotia" },
      { value: "NU", label: "Nunavut" },
      { value: "ON", label: "Ontario" },
      { value: "PE", label: "Prince Edward Island" },
      { value: "QC", label: "Quebec" },
      { value: "SK", label: "Saskatchewan" },
      { value: "YT", label: "Yukon" },
    ];
    const getSummaryData = async (location) => {
      if (activeLocation === "canada") {
          return;
      }
      if (activeLocation === "all") {
        // Handle the 'All Provinces' option
        const responses = await Promise.all(
          locationList
            .filter(loc => loc.value !== "all") // Exclude 'All Provinces' from the fetch calls
            .map(loc => fetch(`${baseUrl}/summary?loc=${loc.value}`))
        );
    
        const data = await Promise.all(responses.map(async (res) => {
          try {
            if (!res.ok) {
              throw new Error(`API call failed: ${res.status}`);
            }
            return await res.json();
          } catch (error) {
            console.error(error.message);
            return null; // or appropriate error handling
          }
        }));
        
        // Aggregate data for all provinces here
        // This is a simple example, adjust aggregation logic as needed
        let aggregatedData = data.reduce((acc, current) => {
          const summary = current.data[0];
          return {
            cases: (acc.cases || 0) + summary.cases,
            tests_completed: (acc.tests_completed || 0) + summary.tests_completed,
            deaths: (acc.deaths || 0) + summary.deaths,
            vaccine_administration_total_doses: (acc.vaccine_administration_total_doses || 0) + summary.vaccine_administration_total_doses,
            // Add other relevant fields here in a similar manner
          };
        }, {});
    
        let formattedData = {};
    
        Object.keys(aggregatedData).map(
          (key) => (formattedData[key] = aggregatedData[key].toLocaleString())
        );
        setSummaryData(formattedData);
      } else {
        let res = await fetch(`${baseUrl}/summary?loc=${activeLocation}`);
        let resData = await res.json();
        let summaryData = resData.data[0];
        let formattedData = {};
    
        Object.keys(summaryData).map(
          (key) => (formattedData[key] = summaryData[key].toLocaleString())
        );
        console.log(formattedData)
        setSummaryData(formattedData);
      }
    };
    
    const [summaryData, setSummaryData] = useState({});
    const [activeLocation, setActiveLocation] = useState("AB");
    const [lastUpdated, setlastUpdated] = useState("");
    useEffect(() => {
      getSummaryData();
      getVersion();
    }, [activeLocation]);
    const baseUrl = "https://api.opencovid.ca";
    const getVersion = async () => {
        const res = await fetch(`${baseUrl}/version`);
        const data = await res.json();
        setlastUpdated(data.timeseries);
    };
    //return statement goes below this
    return (
    <div className="App">
        <h1>COVID 19 Dashboard </h1>
        <div className="dashboard-container">
        <div className="dashboard-menu ">
            <Select
            options={locationList}
            onChange={(selectedOption) =>
                setActiveLocation(selectedOption.value)
            }
            defaultValue={locationList.filter(
                (options) => options.value === activeLocation
            )}
            className="dashboard-select"
            />
            <p className="update-date">
            Last Updated : {lastUpdated}
            </p>
        </div>
        <div className="dashboard-summary">
            <Card title="Total Cases" value={summaryData.cases} />
            <Card
            title="Total Tests"
            value={summaryData.tests_completed}
            />
            <Card title="Total Deaths" value={summaryData.deaths  } />
            <Card
            title="Total Vaccinated"
            value={summaryData.vaccine_administration_total_doses}
            />
        </div>
        </div>
        <div className="stat-table">
             <h2 style={{ textAlign: 'center' }}>Further Statistics</h2>
            <table>
                <thead>
                <tr>
                    <th>Statistic</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(summaryData).map(([key, value]) => (
                    <tr key={key}>
                    <td>{key.replace(/_/g, ' ').toUpperCase()}</td>
                    <td>{value}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <div className="link-container">
            <Link to="/heatmap">Go to Heatmaps</Link>
        </div>
    </div>
    );
}

export default MainPage;
