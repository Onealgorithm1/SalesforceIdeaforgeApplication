public with sharing class UiRoadmapController {

    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getUIIdeas() {

        List<Idea__c> ideas = [
            SELECT Id,
                   Name,
                   Description__c,
                   Category__c,
                   Tags__c,
                   Status__c,
                   Likes__c,
                   Points__c,
                   CreatedBy.Name
            FROM Idea__c
            WHERE Category__c = 'UI'
            ORDER BY CreatedDate DESC
        ];

        Map<Id, Integer> countMap = new Map<Id, Integer>();

        for(AggregateResult ar : [
            SELECT Idea__c iId,
                   COUNT(Id) cnt
            FROM Idea_Comment__c
            GROUP BY Idea__c
        ]){
            countMap.put(
                (Id)ar.get('iId'),
                (Integer)ar.get('cnt')
            );
        }

        List<Map<String, Object>> result =
            new List<Map<String, Object>>();

        for(Idea__c i : ideas){

            Map<String, Object> row =
                new Map<String, Object>();

            row.put('Id', i.Id);
            row.put('Name', i.Name);
            row.put('Description__c', i.Description__c);
            row.put('Category__c', i.Category__c);
            row.put('Tags__c', i.Tags__c);
            row.put('Status__c', i.Status__c);
            row.put('Likes__c', i.Likes__c);
            row.put('Points__c', i.Points__c);
            row.put('Author', i.CreatedBy.Name);

            row.put(
                'commentCount',
                countMap.containsKey(i.Id)
                ? countMap.get(i.Id)
                : 0
            );

            result.add(row);
        }

        return result;
    }

    @AuraEnabled
    public static void likeIdea(Id ideaId){
        IdeaBoardController.likeIdea(ideaId);
    }

    @AuraEnabled
    public static void unlikeIdea(Id ideaId){
        IdeaBoardController.unlikeIdea(ideaId);
    }

    @AuraEnabled
    public static void addComment(Id ideaId, String txt){
        IdeaBoardController.addComment(ideaId, txt);
    }

    @AuraEnabled(cacheable=true)
    public static List<Idea_Comment__c> getComments(Id ideaId){
        return IdeaBoardController.getComments(ideaId);
    }

    @AuraEnabled
    public static void updateIdeaStatus(
        Id ideaId,
        String newStatus
    ){
        IdeaBoardController.updateIdeaStatus(
            ideaId,
            newStatus
        );
    }
}