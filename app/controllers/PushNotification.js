var Cloud = require("ti.cloud");
var CloudPush = require('ti.cloudpush');
if (Ti.App.Properties.getBool('toogle') !== true || false) {
	$.basicSwitch.value = false;
	Ti.API.info('toogle');
	Ti.API.info("value : " + $.basicSwitch.value);
}
else {
	$.basicSwitch.value = Ti.App.Properties.getBool('toogle');
	Ti.API.info('toogle');
}

function ganti() {
	if ($.basicSwitch.value == true) {
		Ti.App.Properties.setBool('toogle', true);
		Ti.API.info(Ti.App.Properties.getBool('toogle'));
		Ti.API.log('Retrieve Device Token');
		CloudPush.retrieveDeviceToken({
			success : function deviceTokenSuccess(e) {
				Ti.API.info('Device Token: ' + e.deviceToken);
				Ti.App.Properties.setString('dvcToken', e.deviceToken);;
				Ti.API.log('Subscribe Device Token');
				Cloud.PushNotifications.subscribeToken({
					channel : 'gcm',
					device_token : e.deviceToken,
					type : 'android'
				}, function(e) {
					if (e.success) {
						alert('Subscribe Success');
					} else {
						alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
						Ti.API.info('Subscribe Error ' + ((e.error && e.message) || JSON.stringify(e)));
					}
				});

				CloudPush.addEventListener('callback', function(e) {
					alert('payload : ' + e.payload);
				});
			},
			error : function deviceTokenError(e) {
				alert('Failed to register for push! ' + JSON.stringify(e));
			}
		});
	} else {
		Ti.App.Properties.setBool('toogle', false);
		Ti.API.info(Ti.App.Properties.getBool('toogle'));
		Cloud.PushNotifications.unsubscribeToken({
			channel : 'gcm',
			device_token : Ti.App.Properties.getString('dvcToken'),
			type : 'android'
		}, function(e) {
			if (e.success) {
				alert('Unsubscribe Success');
			} else {
				alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				Ti.API.info('Unsubscribe Error ' + ((e.error && e.message) || JSON.stringify(e)));
			}
		});
	}
}