import {
	StyleSheet,
	Text,
	ImageBackground,
	FlatList,
	StatusBar,
	View,
} from 'react-native';
import {
	SafeAreaView,
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import * as React from 'react';
import WeatherDisplay from '../components/WeatherDisplay';
import axios from 'axios';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { API_KEY } from '@env';

const currentTime = new Date().getHours();
const isNightTime = currentTime >= 18 || currentTime < 6;

const nightImage = require('../assets/images/night.jpg');
const dayImage = require('../assets/images/day.jpg');

export default function Weather() {
	const insets = useSafeAreaInsets();
	const [weatherData, setWeatherData] = useState<any>(null);
	const [location, setLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	useEffect(() => {
		const fetchWeatherData = async (latitude: number, longitude: number) => {
			try {
				const response = await axios.get(
					`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7`
				);
				setWeatherData(response.data);
			} catch (error) {
				console.error('Error fetching weather data:', error);
				setErrorMsg('Error fetching weather data');
			}
		};

		const getLocation = async () => {
			try {
				let { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== 'granted') {
					setErrorMsg('Permission to access location was denied');
					return;
				}

				let location = await Location.getCurrentPositionAsync({});
				const { latitude, longitude } = location.coords;
				setLocation({ latitude, longitude });
				fetchWeatherData(latitude, longitude);
			} catch (error) {
				console.error('Error getting location:', error);
				setErrorMsg('Error getting location');
			}
		};

		getLocation();
	}, []);

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.safeArea}>
				<StatusBar
					translucent
					backgroundColor="transparent"
					barStyle={isNightTime ? 'light-content' : 'dark-content'}
				/>
				<ImageBackground
					source={isNightTime ? nightImage : dayImage}
					style={styles.background}
				>
					<View
						style={{
							flex: 1,
							paddingTop: insets.top,
							paddingBottom: insets.bottom,
						}}
					>
						{errorMsg ? (
							<Text style={styles.errorText}>{errorMsg}</Text>
						) : (
							<FlatList
								data={[weatherData]}
								renderItem={({ item }) => (
									<WeatherDisplay
										isNightTime={isNightTime}
										weatherData={item}
									/>
								)}
								keyExtractor={(item, index) => index.toString()}
								contentContainerStyle={styles.flatListContent}
								showsVerticalScrollIndicator={false}
							/>
						)}
					</View>
				</ImageBackground>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	background: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	flatListContent: {
		flexGrow: 1,
	},
	errorText: {
		color: 'red',
		fontSize: 18,
		textAlign: 'center',
		marginTop: 20,
	},
});
