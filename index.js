'use strict';

var async = require('async'),
    CronJob = require('cron').CronJob,
    // Extensions = require('periodicjs.core.extensions'),
    // CoreExtension = new Extensions({}),
    CoreExtension,
    fs = require('fs-extra'),
    path = require('path'),
    appSettings,
    mongoose,
    Compilation,
    Collection,
    Item, //Item
    scheduled_itemid_array = [],
    scheduled_collectionid_array = [],
    unpublished_content_interval ='1 * * * * *',
    logger;

/**
 * query mongoose for document that are unpublished and have a publish date that has passed
 */
var publishScheduledItemCollectionss = function () {
    scheduled_collectionid_array = [];
    scheduled_itemid_array = [];

    /**
     * update a document publish status if the publish at date is passed and the status is "schedule"
     * @param  {object}   model    which mongoose model to update (item or collection)
     * @param  {Function} callback async callback function
     * @return {Function}            callback(err,status)
     */
    var updateScheduledContent = function (model, callback) {
        model
            .update({
                    status: 'schedule',
                    publishat: {
                        $lt: new Date()
                    }
                }, {
                    status: 'publish'
                }, {
                    multi: true
                },
                function (err, numberAffected, raw) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        if (numberAffected > 0) {
                            callback(null, 'number of updates items: ' + numberAffected + ' - ' + (new Date()),raw);
                        }
                        else {
                            callback(null, null);
                        }
                    }
                }
        );
    };

    try {
        var job = new CronJob({
            cronTime: unpublished_content_interval,
            onTick: function () {
                async.parallel({
                        scheduledItems: function (callback) {
                            updateScheduledContent(Item, callback);
                        },
                        scheduledCollections: function (callback) {
                            updateScheduledContent(Collection, callback);
                        },
                        scheduledCompilations: function (callback) {
                            updateScheduledContent(Compilation, callback);
                        }
                    },
                    function (err, results) {
                        if (err) {
                            logger.error(err);
                        }
                        else {
                            if (results.scheduledItems || results.scheduledCollections) {
                                logger.silly(results.scheduledItems);
                            }
                        }
                    });
            },
            onComplete: function () {}//,
            // start: true
            // timeZone: "America/Los_Angeles"
        });
        // logger.silly(job);
        job.start();
    }
    catch (e) {
        logger.error(e);
    }
};

/**
 * An extension that uses cron to periodically check for unpublished posts to publish.
 * @{@link https://github.com/typesettin/periodicjs.ext.serverside_ra}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @exports periodicjs.ext.serverside_ra
 * @requires module:cron
 * @requires module:fs-extra
 * @requires module:path
 * @requires module:periodicjs.core.extensions
 * @param  {object} periodic variable injection of resources from current periodic instance
 */
module.exports = function (periodic) {
    // express,app,logger,config/settings,db
    logger = periodic.logger;
    mongoose = periodic.mongoose;
    appSettings = periodic.settings;
    Item = mongoose.model('Item');
    Collection = mongoose.model('Collection');
    Compilation = mongoose.model('Compilation');
    CoreExtension = periodic.core.extension;
    
    var serverside_ra_settingsFile = path.resolve(CoreExtension.getconfigdir({
        extname: 'periodicjs.ext.serverside_ra'
    }), './settings.json'),
    appenvironment = appSettings.application.environment,
    scheduledExtSettings;

    fs.readJson(serverside_ra_settingsFile, function (err, settingJSON) {
        if (err) {
            throw new Error(err);
        }
        else {
            // console.log('settingJSON', settingJSON);
            if (settingJSON[appenvironment]) {
                scheduledExtSettings = settingJSON[appenvironment];
                unpublished_content_interval = (scheduledExtSettings && scheduledExtSettings.settings.unpublished_content_interval)? scheduledExtSettings.settings.unpublished_content_interval : unpublished_content_interval;                
            }
            else {
                periodic.logger.warn('Invalid scheduled content config for env: ' + appenvironment);
            }
        }
        publishScheduledItemCollectionss();
    });

    return periodic;
};