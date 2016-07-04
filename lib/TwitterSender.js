var AbstractComponent = require('kevoree-entities').AbstractComponent;
var Twitter = require('twitter');

/**
 * Kevoree component
 * @type {TwitterSender}
 */
var TwitterSender = AbstractComponent.extend({
    toString: 'TwitterSender',


    construct: function () {
        this.client = null;
    },

    /* This is an example of dictionary attribute that you can set for your entity */
    dic_consumer_key: {
        optional: false,
        defaultValue: ''
    },

    dic_consumer_secret: {
        optional: false,
        defaultValue: ''
    },

    dic_access_token_key: {
        optional: false,
        defaultValue: ''
    },

    dic_access_token_secret: {
        optional: false,
        defaultValue: ''
    },

    start: function (done) {
        this.log.debug(this.toString(), 'START');

        this.client = new Twitter({
            consumer_key: this.dictionary.getString('consumer_key', ''),
            consumer_secret: this.dictionary.getString('consumer_secret', ''),
            access_token_key: this.dictionary.getString('access_token_key', ''),
            access_token_secret: this.dictionary.getString('access_token_secret', '')
        });

        done();
    },

    stop: function (done) {
        this.log.debug(this.toString(), 'STOP');
        this.client = null;
        done();
    },

    update: function (done) {
        this.stop(function () {
            this.start(done);
        }.bind(this));
    },
    
    in_input: function (msg) {

        this.log.debug('INPUT : ' + msg);
        var that = this;
        this.client.post('statuses/update', {status: msg}, function(error, tweet, response) {
            if (!error) {
                that.log.info('SEND : ' + tweet);
            } else {
                that.log.error('SEND : ' + error);
            }
        });
    }

    
});

module.exports = TwitterSender;
