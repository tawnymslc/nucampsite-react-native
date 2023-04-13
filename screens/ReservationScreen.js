import { useState } from "react";
import { 
    Text, 
    View, 
    ScrollView, 
    StyleSheet, 
    Switch, 
    Button, 
    Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import * as Notifications from 'expo-notifications';

const ReservationScreen = () => {
    const [campers, setCampers] = useState(1);
    const [hikeIn, setHikeIn] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowCalendar(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleReservation = () => {
        Alert.alert(
            'Begin Search?',
            'Number of campers: ' + campers + '\n\nHike-In? ' + hikeIn + '\n\nDate: ' + date.toLocaleDateString('en-US'),
            [
                {
                    text: 'Cancel',
                    onPress: () => resetForm(),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        presentLocalNotification(date.toLocaleDateString('en-US'))
                        resetForm()
                    }
                }
            ],
        )
    };

    const resetForm = () => {
        setCampers(1);
        setHikeIn(false);
        setDate(new Date());
        setShowCalendar(false);
    };

    const presentLocalNotification = async (reservationDate) => {
        const sendNotification = () => {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true
                })
            });

            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Your Campsite Reservation Search',
                    body: `Search for ${reservationDate} requested`
                },
                trigger: null
            })
        };

        let permissions = await Notifications.getPermissionsAsync();
        if (!permissions.granted) {
            permissions = await Notifications.requestPermissionsAsync();
        }
        if (permissions.granted) {
            sendNotification();
        }
    };

    return (
        <ScrollView>
            <Animatable.View
                animation='zoomIn'
                duration={2000}
                delay={1000}
            >
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Campers:</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={campers}
                        onValueChange={itemValue => setCampers(itemValue)}
                    >
                        <Picker.Item label='1' value={1} /> 
                        <Picker.Item label='2' value={2} /> 
                        <Picker.Item label='3' value={3} /> 
                        <Picker.Item label='4' value={4} /> 
                        <Picker.Item label='5' value={5} /> 
                        <Picker.Item label='6' value={6} />   
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Hike In?</Text>
                    <Switch
                        style={styles.formItem}
                        value={hikeIn}
                        trackColor={{ true: '#5637DD', false: null }}
                        onValueChange={value => setHikeIn(value)}
                    />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date:</Text>
                    <Button
                        onPress={() => setShowCalendar(!showCalendar)}
                        title={date.toLocaleDateString('en-US')}
                        color='#5637DD'
                        accessibilityLabel='Tap me to select a reservation date'
                    />
                </View>
                {showCalendar && (
                    <DateTimePicker
                        style={styles.formItem}
                        value={date}
                        mode='date'
                        display='default'
                        onChange={onDateChange}
                    />
                )}
                <View style={styles.formRow}>
                    <Button 
                        onPress={() => handleReservation()}
                        title='Search Availability'
                        color='#5637DD'
                        accessibilityLabel='Tap me to search for available campsites to reserve'
                    />
                </View>
            </Animatable.View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    }
});

export default ReservationScreen;