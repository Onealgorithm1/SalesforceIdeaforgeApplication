public without sharing class BugsRoadmapController {

    @AuraEnabled(cacheable=true)
    public static List<Map<String,Object>> getBugIdeas(){

        List<Idea__c> ideas = [
            SELECT Id,
                   Name,
                   Description__c,
                   Category__c,
                   Status__c,
                   Likes__c,
                   Points__c,
                   CreatedBy.Name
            FROM Idea__c
            WHERE Category__c = 'Bugs'
            ORDER BY CreatedDate DESC
        ];

        Map<Id,Integer> commentMap = new Map<Id,Integer>();

        for(AggregateResult ar : [
            SELECT Idea__c iId,
                   COUNT(Id) total
            FROM Idea_Comment__c
            GROUP BY Idea__c
        ]){
            commentMap.put(
                (Id)ar.get('iId'),
                (Integer)ar.get('total')
            );
        }

        List<Map<String,Object>> results =
            new List<Map<String,Object>>();

        for(Idea__c idea : ideas){

            Map<String,Object> row =
                new Map<String,Object>();

            row.put('Id', idea.Id);
            row.put('Name', idea.Name);
            row.put('Description__c', idea.Description__c);
            row.put('Category__c', idea.Category__c);
            row.put('Status__c', idea.Status__c);
            row.put('Likes__c', idea.Likes__c);
            row.put('Points__c', idea.Points__c);
            row.put('Author', idea.CreatedBy.Name);

            row.put(
                'commentCount',
                commentMap.containsKey(idea.Id)
                ? commentMap.get(idea.Id)
                : 0
            );

            results.add(row);
        }

        return results;
    }

    @AuraEnabled
    public static void updateIdeaStatus(
        Id ideaId,
        String newStatus
    ){
        update new Idea__c(
            Id = ideaId,
            Status__c = newStatus
        );
    }

    @AuraEnabled
    public static void addComment(
        Id ideaId,
        String commentText
    ){
        insert new Idea_Comment__c(
            Idea__c = ideaId,
            Comment__c = commentText
        );
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String,Object>> getComments(
        Id ideaId
    ){

        List<Map<String,Object>> result =
            new List<Map<String,Object>>();

        for(Idea_Comment__c c : [

            SELECT Id,
                   Comment__c,
                   CreatedDate,
                   CreatedBy.Name

            FROM Idea_Comment__c

            WHERE Idea__c = :ideaId

            ORDER BY CreatedDate DESC
        ]){

            Map<String,Object> row =
                new Map<String,Object>();

            row.put('Id', c.Id);
            row.put('Comment__c', c.Comment__c);
            row.put('Author', c.CreatedBy.Name);

            result.add(row);
        }

        return result;
    }

    @AuraEnabled
    public static void likeIdea(Id ideaId){

        Idea__c idea = [

            SELECT Likes__c

            FROM Idea__c

            WHERE Id = :ideaId
        ];

        idea.Likes__c =
            (idea.Likes__c == null ? 0 : idea.Likes__c) + 1;

        update idea;
    }

    @AuraEnabled
    public static void unlikeIdea(Id ideaId){

        Idea__c idea = [

            SELECT Likes__c

            FROM Idea__c

            WHERE Id = :ideaId
        ];

        idea.Likes__c =
            (idea.Likes__c == null ? 0 : idea.Likes__c) - 1;

        update idea;
    }
}