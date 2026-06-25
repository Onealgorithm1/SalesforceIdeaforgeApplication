public with sharing class EventController {

    @AuraEnabled(cacheable=true)
    public static List<Event__c> getEvents() {

        return [

            SELECT
                Id,
                Name,
                Event_Type__c,
                Event_Description__c,
                Event_Date_Time__c,
                Event_Location__c,
                Status__c,
                Vote_Count__c,
                Cover_Image_URL__c,
                CreatedDate,
                CreatedBy.Name

            FROM Event__c

            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Event__c getEventDetails(Id eventId){

        return [

            SELECT
                Id,
                Name,
                Event_Type__c,
                Event_Description__c,
                Event_Date_Time__c,
                Event_Location__c,
                Status__c,
                Vote_Count__c,
                //Cover_Image_URL__c,
                CreatedBy.Name

            FROM Event__c

            WHERE Id = :eventId
            LIMIT 1
        ];
    }

    @AuraEnabled
    public static Id createEvent(

        String title,
        String description,
        String eventType,
        String location,
        String eventDateTime,
        String imageUrl

    ){

        try{

            Event__c ev = new Event__c();

            ev.Name = title;
            ev.Event_Description__c = description;
            ev.Event_Type__c = eventType;
            ev.Event_Location__c = location;

            if(String.isNotBlank(eventDateTime)){

                ev.Event_Date_Time__c =
                    Datetime.valueOf(
                        eventDateTime
                            .replace('T',' ')
                            .replace('Z','')
                    );
            }

            ev.Cover_Image_URL__c = imageUrl;
            ev.Status__c = 'Active';
            ev.Vote_Count__c = 0;

            insert ev;

            return ev.Id;

        }catch(Exception e){

            throw new AuraHandledException(
                'Error Creating Event : ' +
                e.getMessage()
            );

        }
    }

    @AuraEnabled
    public static Integer upVote(Id eventId){

        Event__c ev = [

            SELECT
                Id,
                Vote_Count__c

            FROM Event__c

            WHERE Id = :eventId
            LIMIT 1
        ];

        if(ev.Vote_Count__c == null){

            ev.Vote_Count__c = 0;
        }

        ev.Vote_Count__c++;

        update ev;

        return Integer.valueOf(
            ev.Vote_Count__c
        );
    }

    @AuraEnabled
    public static Integer downVote(Id eventId){

        Event__c ev = [

            SELECT
                Id,
                Vote_Count__c

            FROM Event__c

            WHERE Id = :eventId
            LIMIT 1
        ];

        if(ev.Vote_Count__c == null){

            ev.Vote_Count__c = 0;
        }

        if(ev.Vote_Count__c > 0){

            ev.Vote_Count__c--;
        }

        update ev;

        return Integer.valueOf(
            ev.Vote_Count__c
        );
    }

}