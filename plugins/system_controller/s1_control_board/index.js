'use strict';

var libQ = require('kew');
var fs=require('fs-extra');
var config = new (require('v-conf'))();
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

const SerialPort = require("serialport");
const serialPort = new SerialPort("/dev/ttyUSB0", { baudRate: 57600, autoOpen: true });

module.exports = s1ControlBoard;
function s1ControlBoard(context) {
	var self = this;

	this.context = context;
	this.commandRouter = this.context.coreCommand;
	this.logger = this.context.logger;
	this.configManager = this.context.configManager;

}



s1ControlBoard.prototype.onVolumioStart = function()
{
	var self = this;
	var configFile=this.commandRouter.pluginManager.getConfigurationFile(this.context,'config.json');
	this.config = new (require('v-conf'))();
	this.config.loadFile(configFile);

    return libQ.resolve();
}

s1ControlBoard.prototype.onStart = function() {
    var self = this;
	var defer=libQ.defer();


	serialPort.write("SYS_ON\n");
	defer.resolve();

    return defer.promise;
};

s1ControlBoard.prototype.onStop = function() {
    var self = this;
    var defer=libQ.defer();

    serialPort.write("SYS_OFF\n");
    defer.resolve();

    return libQ.resolve();
};

s1ControlBoard.prototype.onRestart = function() {
    var self = this;
    serialPort.write("SYS_RESTART\n");
};


// Configuration Methods -----------------------------------------------------------------------------

s1ControlBoard.prototype.getUIConfig = function() {
    var defer = libQ.defer();
    var self = this;

    var lang_code = this.commandRouter.sharedVars.get('language_code');

    self.commandRouter.i18nJson(__dirname+'/i18n/strings_'+lang_code+'.json',
        __dirname+'/i18n/strings_en.json',
        __dirname + '/UIConfig.json')
        .then(function(uiconf)
        {


            defer.resolve(uiconf);
        })
        .fail(function()
        {
            defer.reject(new Error());
        });

    return defer.promise;
};

s1ControlBoard.prototype.getConfigurationFiles = function() {
	return ['config.json'];
}

s1ControlBoard.prototype.setUIConfig = function(data) {

};

s1ControlBoard.prototype.getConf = function(varName) {

};

s1ControlBoard.prototype.setConf = function(varName, varValue) {

};
