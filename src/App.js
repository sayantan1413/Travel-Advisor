import React, { useEffect, useState } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';
import Header from './Components/Header/Header';
import List from './Components/List/List';
import Map from './Components/Map/Map';
import { getPlacesData } from './api'
const App = () => {

    const [places, setPlaces] = useState([]);
    const [coordinates, setCoordinates] = useState();
    const [bounds, setBounds] = useState({});
    const [childClicked, setChildClicked] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('restuarents')
    const [rating, setRating] = useState('')
    const [filteredData, setFilteredData] = useState([])

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(({coords : {latitude, longitude}}) => {
            setCoordinates({lat: latitude, lng: longitude});
        })
    }, [])

    useEffect(() => {
        console.log(coordinates, bounds);
        if(bounds.sw && bounds.ne){
        setIsLoading(true);
        getPlacesData(type, bounds.sw, bounds.ne)
        .then((data)=> {    
            console.log(data);
            setPlaces(data?.filter((place) => place.name && place.num_reviews > 0))
            setFilteredData([]);
            setIsLoading(false);
        })
    }
    }, [type, bounds])

    useEffect(() => {
        const filteredData = places.filter((place) => place.rating > rating);
        setFilteredData(filteredData);
    }, [rating])

    return(
        <>
            <CssBaseline />
            <Header 
                setCoordinates={setCoordinates}
            />
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List 
                        places={filteredData.length ? filteredData : places}
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map 
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={filteredData.length ? filteredData : places}
                        setChildClicked={setChildClicked}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default App;