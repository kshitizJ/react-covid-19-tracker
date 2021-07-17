import React, { useEffect, useState } from 'react'
import { FormControl, MenuItem, Select } from '@material-ui/core';
import InfoBox from './InfoBox';
import './App.css';

function App() {

    // initializing the countries variable with empty array
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState('worldwide')

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
                    setCountries(countries)
                })
        }
        getCountriesData();
    }, [])

    const onCountryChange = async (event) => {
        const countryCode = event.target.value
        setCountry(countryCode)
    }

    return (
        <div className="app">
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
                <InfoBox title="Coronavirus Cases" cases={525} total={2000} />

                {/* Infobox title = "Coronavirus Recoveries" */}
                <InfoBox title="Recovered" cases={5256} total={3000} />

                {/* Infobox */}
                <InfoBox title="Deaths" cases={52} total={300} />
            </div>


            {/* Table */}
            {/* Graph */}

            {/* Map */}
        </div>
    );
}

export default App;
