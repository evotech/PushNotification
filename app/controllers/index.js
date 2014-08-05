function openPushNotif(e) {
	var goPushNotif = Alloy.createController('PushNotification').getView();
	goPushNotif.open();
}

$.index.open();
