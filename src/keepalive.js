var request = require('request');

module.exports = {
    displayname : 'Web Keepalive',
    description : 'Makes request to self, keeping the service alive on providers like Heroku.',

    init : function (bot) {
        bot.configLoader.ensure('keepalive_interval', 15, 'Interval in minutes to ping self');
        bot.configLoader.ensure('keepalive_sleep', '20:00', 'Time to begin sleep (Heroku needs 6+ hours idle time)');
        bot.configLoader.ensure('keepalive_wake', '8:00', 'Time to wake up');

        var url = 'http://' + bot.config.web_host + '/health';
        var sleepTimeS = bot.config.keepalive_sleep.split(':');
        var sleepTime = sleepTimeS[0] * 60 + sleepTimeS[1] * 1;
        var wakeTimeS = bot.config.keepalive_wake.split(':');
        var wakeTime = wakeTimeS[0] * 60 + wakeTimeS[1] * 1;

        console.log('Keeping alive every', bot.config.keepalive_interval, 'minutes at', url);
        setInterval(function () {
                var now = new Date();
                var nowTime = now.getHours() * 60 + now.getMinutes();

                if (nowTime >= wakeTime && nowTime < sleepTime) {
                    console.log("Pingedy")
                    request.get(url, function () {});
                } else {
                    console.log("Skipped keepalive due to sleep interval.");
                }
            }, bot.config.keepalive_interval * 60 * 1000);
    }
};
