var SCORM = {
    api: null,
  
    init: function() {
        this.api = window.parent.API || window.opener.API || window.API;
        if (this.api) {
            console.log("SCORM API is found!");
            var initResult = this.api.LMSInitialize("");
            console.log("SCORM API Init Result: " + initResult);
            return initResult === 'true';
        }
        console.error("SCORM API is not found!");
        return false;
    },

    set: function(param, value) {
        if (this.api) {
            return this.api.LMSSetValue(param, value);
        }
        return false;
    },

    get: function(param) {
        if (this.api) {
            return this.api.LMSGetValue(param);
        }
        return null;
    },

    commit: function() {
        if (this.api) {
            return this.api.LMSCommit("");
        }
        return false;
    },

    getLastError: function() {
        if (this.api) {
            return this.api.LMSGetLastError("");
        }
        return "500";
    },

    getErrorString: function(errorCode) {
        if (this.api) {
            return this.api.LMSGetErrorString(errorCode);
        }
        return errorCode;
    },

    finish: function() {
        if (this.api) {
            var finishResult = this.api.LMSFinish("");
            return finishResult === 'true';
        }
        return false;
    }
};