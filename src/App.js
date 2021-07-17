import React, { useEffect, useState } from 'react'
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import InfoBox from './InfoBox';
import './App.css';
import Map from './Map';
import Table from './Table';
import { prettyPrintStat, sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {

    // initializing the countries variable with empty array
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState('worldwide')
    const [countryInfo, setCountryInfo] = useState({})
    const [tableData, setTableData] = useState([])
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
    const [mapZoom, setMapZoom] = useState(2)
    const [mapCountries, setMapCountries] = useState([])
    const [casesType, setCasesType] = useState("cases")

    // state = HOW TO WRITE A VARIABLE IN REACT
    // useEffect = Runs a piece of code based on a given condition


    useEffect(() => {
        // empty [] in second parameter means code inside here will run once when the component loads not again

        // async -> send a request, wait for it, do something with the info

        // writing async before the function tell the function type i.e the function will be async type and will await while fetching the data.
        const getCountriesData = async () => {
            await fetch('https://disease.sh/v3/covid-19/countries')
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map(country => (
                        {
                            name: country.country, // United States, India, United Kingdom
                            value: country.countryInfo.iso2 // US, IN, UK
                        }
                    ))
                    const sortedData = sortData(data)
                    setTableData(sortedData)
                    setMapCountries(data)
                    setCountries(countries)
                })
        }
        getCountriesData();


        // when the page loads then we want to fetch the worldwide data
        fetch('https://disease.sh/v3/covid-19/all')
            .then(response => response.json())
            .then(data => {
                setCountryInfo(data)
            })


    }, [])

    const onCountryChange = async (event) => {
        const countryCode = event.target.value

        // https://disease.sh/v3/covid-19/all      <<<<<     For worldwide
        // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]     <<<<<    for all other countries

        const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCountry(countryCode)

                // all of the data from the country
                setCountryInfo(data)
                console.log(data);

                setMapCenter([data.countryInfo.lat, data.countryInfo.long])
                setMapZoom(4)
            })
    }

    return (
        <div className="app">
            <div className="app__left">
                {/* Header */}
                <div className="app__header">
                    <h1>Covid 19 tracker</h1>
                    <FormControl className="app__dropdown">
                        {/* Title + Select input dropdown field */}
                        <Select variant="outlined" value={country} onChange={onCountryChange} >
                            <MenuItem value="worldwide">Worldwide</MenuItem>
                            {/* loop through all the countries and show the dropdown list of the option */}
                            {
                                countries.map(country => (
                                    <MenuItem value={country.value}>{country.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>

                <div className="app__stats">
                    {/* Infobox title = "Coronavirus Cases" */}
                    <InfoBox
                        isRed
                        active={casesType === 'cases'}
                        onClick={e => setCasesType('cases')}
                        title="Coronavirus Cases"
                        cases={prettyPrintStat(countryInfo.todayCases)}
                        total={prettyPrintStat(countryInfo.cases)}
                    />

                    {/* Infobox title = "Coronavirus Recoveries" */}
                    <InfoBox
                        active={casesType === 'recovered'}
                        onClick={e => setCasesType('recovered')}
                        title="Recovered"
                        cases={prettyPrintStat(countryInfo.todayRecovered)}
                        total={prettyPrintStat(countryInfo.recovered)}
                    />

                    {/* Infobox */}
                    <InfoBox
                        isGrey
                        active={casesType === 'deaths'}
                        onClick={e => setCasesType('deaths')}
                        title="Deaths"
                        cases={prettyPrintStat(countryInfo.todayDeaths)}
                        total={prettyPrintStat(countryInfo.deaths)}
                    />
                </div>

                {/* Map */}
                <Map
                    casesType={casesType}
                    countries={mapCountries}
                    center={mapCenter}
                    zoom={mapZoom}
                />

            </div>

            <Card className="app__right">
                <CardContent>
                    {/* Table */}
                    <h3>Live Cases By Country</h3>
                    <Table countries={tableData} />
                    {/* Graph */}
                    <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
                    <LineGraph className="app__graph" casesType={casesType} />
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
