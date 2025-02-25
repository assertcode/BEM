sap.ui.define([
    "sap/ui/model/SimpleType",
    "sap/ui/core/format/NumberFormat"
], function (SimpleType, NumberFormat) {
    "use strict";

    const NUMBER_FORMAT_CONFIG = {
        groupingEnabled: true,
        groupingSeparator: ".",
        groupingSize: 3,
        decimalSeparator: ",",
    };

    return SimpleType.extend("sap.ui.demo.myCustomType", {
        
        formatValue: function(fValue) {

            if (fValue === null || fValue === undefined ) {
                return null;
            }

            var oFormat = NumberFormat.getFloatInstance(NUMBER_FORMAT_CONFIG);

            return oFormat.format(fValue);
        },

        parseValue:  function(sapValue) {
            
            var oFormat = NumberFormat.getFloatInstance(NUMBER_FORMAT_CONFIG);

            if( isNaN(oFormat.parse(sapValue))){
                return null;
            }

            return String(oFormat.parse(sapValue));
        },

        validateValue: function() {
            return true;
        }

    });
});