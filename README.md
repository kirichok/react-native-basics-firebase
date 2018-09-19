# react-native-basics-firebase
Helpers on working with Firebase products based on [firebase.io](https://rnfirebase.io/)

## Example of usage

1. Create new instance of Messaging class:

```
    /* Messaging.js */
    import {Messaging} from 'react-native-basics-firebase';
    export const messaging = new Messaging();
```
    
2. On main app screen add:

```
    /* Home.js */
    import {messaging} from "../Messaging";

    class Home extends Component {
        ...
        
        componentDidMount() {
            pushNotifications.addListener(this.changeDeviceToken, this.onNotification);
            // OR
            pushNotifications.addTokenListener(this.changeDeviceToken);
            pushNotifications.addNotificationListener(this.onNotification);
        }
    
        componentWillUnmount() {
            pushNotifications.removeListener(this.changeDeviceToken, this.onNotification);
            // OR
            pushNotifications.removeTokenListener(this.changeDeviceToken);
            pushNotifications.removeNotificationListener(this.onNotification);
        }
        
        changeDeviceToken = token => {
            ...
        };
        
        onNotification = (notification, isPressed, originNotification) => {
            ...
        };
        
        ...
    }
```

## Troubleshooting on installation
1. In `MainApplication.java`:
```
    ...
    import io.invertase.firebase.RNFirebasePackage;
    import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
    import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
    ...
```
```
    protected List<ReactPackage> getPackages() {
         return Arrays.<ReactPackage>asList(
            ...,
            new RNFirebasePackage(),
            new RNFirebaseNotificationsPackage(),
            new RNFirebaseMessagingPackage()
         );
     }
```
    
    
2. Change on `android/build.gradle` if you using old keywords!!!:
    - from `api` to `compile`;
    - from `implementation` to `provided`;
    
     Example is exists on `example/scripts/react-native-firebase/android/build.gradle`
    
