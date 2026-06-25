public with sharing class ProductRoadmapController {

    @AuraEnabled(cacheable=true)
    public static List<Map<String,Object>> getProductIdeas() {

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
            WHERE Category__c = 'Product'
            ORDER BY CreatedDate DESC
        ];

        Map<Id,Integer> commentMap = new Map<Id,Integer>();

        for(AggregateResult ar : [

            SELECT Idea__c ideaId,
                   COUNT(Id) total
            FROM Idea_Comment__c
            GROUP BY Idea__c

        ]){

            commentMap.put(
                (Id)ar.get('ideaId'),
                (Integer)ar.get('total')
            );
        }

        List<Map<String,Object>> result =
            new List<Map<String,Object>>();

        for(Idea__c i : ideas){

            Map<String,Object> row =
                new Map<String,Object>();

            row.put('Id', i.Id);
            row.put('Name', i.Name);
            row.put('Description__c', i.Description__c);
            row.put('Category__c', i.Category__c);
            row.put('Status__c', i.Status__c);
            row.put('Likes__c', i.Likes__c);
            row.put('Points__c', i.Points__c);
            row.put('Author', i.CreatedBy.Name);

            row.put(
                'commentCount',
                commentMap.containsKey(i.Id)
                ? commentMap.get(i.Id)
                : 0
            );

            result.add(row);
        }

        return result;
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
    public static void likeIdea(Id ideaId){

        Idea__c idea = [

            SELECT Likes__c, Points__c
            FROM Idea__c
            WHERE Id = :ideaId

        ];

        idea.Likes__c =
            (idea.Likes__c == null ? 0 : idea.Likes__c) + 1;

        idea.Points__c =
            (idea.Points__c == null ? 0 : idea.Points__c) + 10;

        update idea;
    }

    @AuraEnabled
    public static void unlikeIdea(Id ideaId){

        Idea__c idea = [

            SELECT Likes__c, Points__c
            FROM Idea__c
            WHERE Id = :ideaId

        ];

        idea.Likes__c =
            Math.max(
                0,
                (idea.Likes__c == null ? 0 : idea.Likes__c) - 1
            );

        idea.Points__c =
            Math.max(
                0,
                (idea.Points__c == null ? 0 : idea.Points__c) - 10
            );

        update idea;
    }

    @AuraEnabled(cacheable=true)
    public static List<Idea_Comment__c> getComments(
        Id ideaId
    ){

        return [

            SELECT Id,
                   Comment__c,
                   CreatedBy.Name,
                   CreatedDate
            FROM Idea_Comment__c
            WHERE Idea__c = :ideaId
            ORDER BY CreatedDate DESC

        ];
    }

    @AuraEnabled
    public static void addComment(
        Id ideaId,
        String txt
    ){

        insert new Idea_Comment__c(
            Idea__c = ideaId,
            Comment__c = txt
        );
    }
}