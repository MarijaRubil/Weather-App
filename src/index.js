import React, { useEffect, useState } from "react";
import { View, Text, Alert, SafeAreaView, StyleSheet, ActivityIndicator, ScrollView, Image, Dimensions, FlatList, TextComponent } from "react-native";
import * as Location from "expo-location";
import { RefreshControl } from "react-native";

const openWeatherKey = "086030990b77ea1f2e11d980d9452b67";
let url = `http://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}`;

const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => { 
    setRefreshing(true);
    // ask for permission to access location 
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied!");
    }
    let userLocation = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    const response = await fetch(`${url}&lat=${userLocation.coords.latitude}&lon=${userLocation.coords.longitude}`);
    const data = await response.json();
    if (!response.ok) {
      Alert.alert("Error");
    } else {
      setForecast(data);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadForecast();
  }, []);

  if (!forecast) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const current = forecast.current.weather[0];
  const currentDescription = current.description;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadForecast()} />
        }
        style={{ marginTop: 50 }}
      >
        <Text style={styles.title}>Current Weather</Text>
        <Text style={{ alignItems: "center", textAlign: "center" }}>Your Location</Text>
        
        <View style={styles.currentIcon}>
          <Image
            style={styles.largeIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`
            }}
          />

          <Text style={styles.currentTemp}>
            {Math.round(forecast.current.temp)}°C
          </Text>
        </View>

        <Text style={styles.currentDescription}>
          {currentDescription}
        </Text>

        <View style={styles.extraInfo}>
          <View style={styles.info}>
            <Image
              source={require('../assets/temp.png')}
              style={{ width: 40, height: 40, borderRadius: 40 / 2, marginLeft: 50 }}
            />
              <Text style={styles.feels}>
                Feels like 
            </Text>
            <Text style={styles.text}>
          
              {forecast.current.feels_like}°C
            </Text>
          
            </View>
           

            <View style={styles.info}>
                <Image
                source={require('../assets/humidity.png')}
                style={{ width: 40, height: 40, borderRadius: 40 / 2, marginLeft: 50 }}
                />
                <Text style={styles.feels}>
                    humidity 
                      </Text>
                <Text style={styles.text}>
                {forecast.current.humidity}%
                </Text>
                
        </View>
        </View>
 
                    
            <View>
                <View >
                    <Text style={styles.subtitle}>
                        Hourly forecast
                    </Text>
                </View>
            </View>


            <FlatList
            horizontal
            data={forecast.hourly.slice(0,24)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(hour) =>{
                const weather = hour.item.weather[0];
                var dt = new Date(hour.item.dt * 1000);
                return(
                    <View style={styles.hour}>
                        <Text style={{fontWeight:'bold', color:'black',}}>
                             {dt.toLocaleTimeString().replace(/:\d+ /, '')}
                        </Text>
                        <Text style={{fontWeight:'bold', color:'black',}}>
                            {Math.round(hour.item.temp)}°C
                        </Text>
                        <Image
                            style={styles.smallIcon}
                            source={{
                                uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`

                            }}
                        />

                        <Text style={{fontWeight:'bold', color:'#fff',}}>
                            {weather.description}
                        </Text>
                     </View>
                )
                                  
                
     }} 
    />

                        </ScrollView>
                        </SafeAreaView>
                    );
                    };

                    export default Weather;



                    //Style sheet

                    const styles = StyleSheet.create({
                    container: {
                        flex: 1,
                        backgroundColor: "#ECDBBA",
                    },
                    title: {
                        textAlign: "center",
                        fontSize: 36,
                        fontWeight: "bold",
                        color: "#c84b31",
                    },
                    currentIcon: {
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignContent: 'center'
                    },
                    largeIcon: {
                        width: 300,
                        height: 250
                    },
                    currentTemp: {
                        fontSize: 34,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    },
                    currentDescription: {
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: '200',
                        fontSize: 24,
                        marginBottom: 5
                    },
                    info:{
                        width: Dimensions.get('screen').width/2.5,
                        backgroundColor: '#fff5ee',
                        padding:10,
                        borderRadius:15,
                        justifyContent: 'center'
                    },
                    extraInfo: {
                        flexDirection:'row',
                        marginTop:20,
                        justifyContent:'space-between',
                        padding:10
                    },
                    feels: {
                        fontSize: 20,
                        color: 'black',
                        textAlign: 'center',
                      },
                      
                    text:{
                        fontSize:20,
                        color:'black',
                        textAlign: 'center'
                    },
                    subtitle:{
                        fontSize:25,
                        marginVertical:12,
                        marginLeft:7,
                        color:'#C84B31',
                        fontWeight:'bold' 

              },
              hour:{
                padding:6,
                alignItems: "center"
              },
              smallIcon:{
                width:100,
                height:100
              }
   });
