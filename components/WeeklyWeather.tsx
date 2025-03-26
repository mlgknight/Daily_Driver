import React from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { ForecastDay } from '../types';

interface WeeklyWeatherProps {
	forecast: { forecastday: ForecastDay[] };
	getDayOfWeek: (dateString: number) => string;
	lightDarkVariable: string;
}

export default function WeeklyWeather({
	forecast,
	getDayOfWeek,
	lightDarkVariable,
}: WeeklyWeatherProps) {
	return (
		<View style={[styles.daily, { backgroundColor: lightDarkVariable }]}>
			<Text style={[styles.dailyTemp, styles.dailyTitle]}>DAILY FORECAST</Text>
			<FlatList
				data={forecast.forecastday}
				renderItem={({ item }) => {
					const dayOfWeek = getDayOfWeek(item.date_epoch * 1000);
					return (
						<View style={styles.dailyItem}>
							<Text style={styles.dailyTemp}>{dayOfWeek}</Text>
							<Image
								source={{ uri: `https:${item.day.condition.icon}` }}
								style={styles.dailyIcon}
							/>
							<Text style={styles.dailyTemp}>
								H: {Math.ceil(item.day.maxtemp_f)}° L:{' '}
								{Math.ceil(item.day.mintemp_f)}°
							</Text>
						</View>
					);
				}}
				keyExtractor={(item) => item.date}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.flatListContent}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	daily: {
		width: '80%',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		borderRadius: 15,
		padding: 20,
		justifyContent: 'center',
		marginTop: 20,
	},
	dailyTitle: {
		fontSize: 13,
		fontWeight: 'bold',
		marginBottom: 10,
		padding: 20,
	},
	dailyItem: {
		alignItems: 'center',
		marginVertical: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	dailyIcon: {
		width: 50,
		height: 50,
	},
	dailyTemp: {
		color: 'white',
	},
	flatListContent: {
		paddingBottom: 0,
		borderRadius: 15,
	},
});
