import firebase from 'react-native-firebase';
import EventEmitter from 'events';

const EVENT_ON_TOKEN = 'firebase-on-token',
    EVENT_ON_NOTIFICATION = 'firebase-on-notification';

class Messaging {
    constructor() {
        this._emiter = new EventEmitter();

        this._token = null;
        this._initialNotification = null;

        this.init = this.init.bind(this);
        this.addListener = this.addListener.bind(this);
        this.addNotificationListener = this.addNotificationListener.bind(this);
        this.addTokenListener = this.addTokenListener.bind(this);
        this.removeListener = this.removeListener.bind(this);
        this.removeNotificationListener = this.removeNotificationListener.bind(this);
        this.removeTokenListener = this.removeTokenListener.bind(this);

        this.init();
    }

    get token() {
        return this._token;
    }

    async init() {
        await this.checkPermissions();

        firebase.notifications().onNotificationOpened(this.processNotification('Opened Message', true, true));
        firebase.notifications().onNotification(this.processNotification('Listened Message'));
        firebase.messaging().onMessage(this.processNotification('Silent Message'));

        this._initialNotification = await firebase.notifications().getInitialNotification();

        await this.getToken();
    };

    destroy = id => {
        if (!id) {
            return
        }

        const listeners = this.listeners[id - 1];
        listeners.onChangeToken = null;
        listeners.onNotification = null;
        this.listeners.splice(id - 1, 1);
    };

    addNotificationListener(handle) {
        if (this._initialNotification) {
            handle(this._initialNotification.notification, true, this._initialNotification.notification);
            this._initialNotification = null;
        }

        this._emiter.addListener(EVENT_ON_NOTIFICATION, handle);
    }

    addTokenListener(handle) {
        if (this._token) {
            handle(this._token);
        }
        this._emiter.addListener(EVENT_ON_TOKEN, handle);
    }

    addListener(onToken, onNotification) {
        this.addTokenListener(onToken);
        this.addNotificationListener(onNotification);
    };

    removeNotificationListener(handle) {
        this._emiter.removeListener(EVENT_ON_NOTIFICATION, handle);
    }

    removeTokenListener(handle) {
        this._emiter.removeListener(EVENT_ON_TOKEN, handle);
    }

    removeListener(onToken, onNotification) {
        this.removeNotificationListener(onNotification);
        this.removeTokenListener(onToken);
    };

    getToken = async () => {
        firebase.messaging().onTokenRefresh(this.onTokenChangeHandle);
        this._token = await firebase.messaging().getToken();
        if (this._token) {
            console.log('FCM TOKEN: ', this._token);
        }
    };

    checkPermissions = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (!enabled) {
            try {
                await firebase.messaging().requestPermission();
                return true
            } catch (e) {
                console.log('Check Firebase permissions Error: ', e);
                return false
            }
        }
        return enabled;
    };

    onTokenChangeHandle = async token => {
        console.log(EVENT_ON_TOKEN, '>', token);

        this._token = token;
        this._emiter.emit(EVENT_ON_TOKEN, token);
    };

    processNotification = (name, isPressed = false, inner = false) => notification => {
        console.log('Incoming', name, notification);

        this._emiter.emit(EVENT_ON_NOTIFICATION,
            inner
                ? notification.notification
                : notification,
            isPressed,
            notification
        );

        if (!this._emiter.listenerCount(EVENT_ON_NOTIFICATION)) {
            this._initialNotification = notification;
        }
    }
}

export {Messaging}
