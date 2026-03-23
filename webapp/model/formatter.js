sap.ui.define(["sap/ui/core/format/NumberFormat"], function (NumberFormat) {
    "use strict";

    const NUMBER_FORMAT_CONFIG = {
        groupingEnabled: true,
        groupingSeparator: ".",
        groupingSize: 3,
        decimalSeparator: ",",
    };

    return {
        formatMillisecondsToTime: function (ms) {
            if (!ms) {
                return "";
            }

            var totalSeconds = Math.floor(ms / 1000);
            var hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
            var minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
            var seconds = String(totalSeconds % 60).padStart(2, "0");

            return `${hours}:${minutes}:${seconds}`;
        },

        formatDecimal: function (fValue) {

            if (fValue === null || fValue === undefined) {
                return null;
            }

            var oFormat = NumberFormat.getFloatInstance(NUMBER_FORMAT_CONFIG);

            return oFormat.format(fValue);
        },

        parseDecimal: function (sValue) {
            var oFormat = NumberFormat.getFloatInstance(NUMBER_FORMAT_CONFIG);
            return oFormat.parse(sValue);
        },

        getFornitoriNumber: function(aFornitori) {
            const idx = aFornitori.filter(row => row.codice !== '').length;
            return idx > 0 ? 'Promemoria fornitura (' + idx + ')' : 'Promemoria fornitura';
        }
    };
});