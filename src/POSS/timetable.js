
module.exports = {
    getTimetableScript: (token, userid) => {
        return `
        var callback = arguments[arguments.length - 1];
        $.ajax({
            url : "/starspossfbstud/secure/ui_make_book/timetable.json?CSRFToken=${token}",
            method : "POST",
            dataType : "json",
            data : {
                "CSRFToken": "${token}",
                "fbUserId": ${userid},
                "bookType": "INDV",
                "dataSetId": 18,
                "actvId": 101,
                "searchDate": null,
                "ctrId": 103,
                "facilityId": null,
                "showCourtAreaDetails": true
            },
            success: callback
        });`
    },
    haveVacancy: timeSlot => {
        if(!timeSlot) return null;
        if(!timeSlot.facilityIds) return null;
        if(timeSlot.facilityIds.length <= 0) return null;
        if(!timeSlot.occupiedFacilityIds) return null;
        if(timeSlot.occupiedFacilityIds.length <= 0) return null;

        const facIds = timeSlot.facilityIds;
        const occupiedFacIds = timeSlot.occupiedFacilityIds;

        for(var i = 0; i < facIds.length; i++){
            if(occupiedFacIds.includes(facIds[i])) return false;
        }

        return true;
    }
}