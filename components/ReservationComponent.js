import React, { Component } from 'react';
import { View, StyleSheet, Picker, Text, Switch, Button,Modal,Alert} from 'react-native';
import {Input} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';

class Resevation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: (new Date()),
            datePickerVisible: false,
            timePickerVisible:false,
            showModal: false
        }
    }
    
    // static navigationOptions = {
    //     title: 'Reserve Table'
    // }
    toggleModal() {
        this.setState({showModal: !this.state.showModal});

    }
    handleReservation() {
        console.log(JSON.stringify(this.state));
        const Date = this.state.date;
        Alert.alert(
            'Your Reservation OK ? ',
            'No. of Guests: ' + this.state.guests + '\nSmoking? '+this.state.smoking+'\nDate and Time: '+this.state.date,
            [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () =>  {
                this.presentLocalNotification(Date)
                this.addReservationToCalendar(Date)}},
            ],
            { cancelable: false }
        );
        this.resetForm();
    }
    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to calendar');
            }
        }
        return permission;
    }

    async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();
        const calendars = await Calendar.getCalendarsAsync();
        const startDate= new Date(Date.parse(date))
        const endDate = new Date(Date.parse(startDate)+(2*60*60*1000));
        Calendar.createEventAsync(calendars[1].id,{
            title:'Con Fusion Table Reservation',
            startDate,
            endDate,
            location:'121, Clear Water Bay Road Clear Water Bay, Kowloon HONG KONG',
        })
    }

    render() {
        return (
            <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
            <ScrollView>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number Of Guests</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.guests}
                        onValueChange={(itemValue, itemIndex) => this.setState({ guests: itemValue })}>
                        <Picker.Item label='1' value='1' />
                        <Picker.Item label='2' value='2' />
                        <Picker.Item label='3' value='3' />
                        <Picker.Item label='4' value='4' />
                        <Picker.Item label='5' value='5' />
                        <Picker.Item label='6' value='6' />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.smoking}
                        trackColor='#512DA8'
                        onValueChange={(value) => this.setState({ smoking: value })} />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date and Time</Text>
                    <TouchableOpacity 
                    onPress={() => this.setState({datePickerVisible: true, })}
                    style={styles.formItem}
                    >
                        <Input
                        placeholder={this.state.date.toString()}
                        editable= {false}
                        value={this.state.date.toString()}
                        containerStyle={styles.formItem}
                    />
                    </TouchableOpacity>
                    </View>
                {this.state.datePickerVisible && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.date}
                        mode="date"
                        display="default"
                        onChange={(event, value) => {
                            if(value!==undefined){
                                this.setState({
                                    date: new Date(value),
                                    datePickerVisible: Platform.OS === 'ios' ? true : false,
                                    timePickerVisible: Platform.OS === 'ios' ? false : true
                                });
                            }

                            if (event.type === "set")
                                console.log("value:" , value);
                        }}
                    />
                )}
                {this.state.timePickerVisible && (
                <DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.date}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, value) => {
                            if(value!==undefined){
                                this.setState({
                                    date: new Date(value),
                                    timePickerVisible: false,
                                });
                            }

                            if (event.type === "set")
                                console.log("value:" , value);
                        }}
                    />
                )}
        <View style={styles.formRow}>
            <Button
                onPress={() => this.handleReservation()}
                title="Reserve"
                color="#512DA8"
                accessibilityLabel="Learn more about this purple button"
            />
        </View>
        </ScrollView >
        </Animatable.View>
        )
    }
}
const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 20,
        flexDirection: 'row'
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     }
});

export default Resevation;