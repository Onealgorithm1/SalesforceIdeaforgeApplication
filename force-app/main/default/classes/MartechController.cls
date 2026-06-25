public with sharing class MartechController {

    @AuraEnabled(cacheable=true)
    public static List<Idea__c> getIdeas() {

        return [

            SELECT
                Id,
                Name,
                Description__c,
                Category__c,
                Status__c,
                Votes__c,
                CreatedDate,
                CreatedBy.Name,
                (SELECT Id FROM Comments__r)

            FROM Idea__c

            WHERE Category__c = 'MarTech'

            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Comment__c> getComments(Id ideaId){

        return [

            SELECT
                Id,
                Comment_Text__c,
                CreatedDate,
                CreatedBy.Name

            FROM Comment__c

            WHERE Idea__c = :ideaId

            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled
    public static void saveComment(
        Id ideaId,
        String commentText
    ){

        Comment__c c = new Comment__c();

        c.Idea__c = ideaId;
        c.Comment_Text__c = commentText;

        insert c;
    }

    @AuraEnabled
    public static Integer upvoteIdea(Id ideaId){

        Idea__c idea = [

            SELECT Id, Votes__c
            FROM Idea__c
            WHERE Id=:ideaId
            LIMIT 1
        ];

        if(idea.Votes__c == null){

            idea.Votes__c = 0;

        }

        idea.Votes__c += 10;

        update idea;

        return Integer.valueOf(
            idea.Votes__c
        );
    }

    @AuraEnabled
    public static Integer downvoteIdea(Id ideaId){

        Idea__c idea = [

            SELECT Id, Votes__c
            FROM Idea__c
            WHERE Id=:ideaId
            LIMIT 1
        ];

        if(idea.Votes__c == null){

            idea.Votes__c = 0;

        }

        idea.Votes__c -= 10;

        update idea;

        return Integer.valueOf(
            idea.Votes__c
        );
    }

    @AuraEnabled(cacheable=true)
    public static Integer getIdeationCount(){

        return [

            SELECT Count()
            FROM Idea__c
            WHERE Category__c='MarTech'
            AND Status__c='Ideation'
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Integer getDevelopmentCount(){

        return [

            SELECT Count()
            FROM Idea__c
            WHERE Category__c='MarTech'
            AND Status__c='In Development'
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Integer getProductionCount(){

        return [

            SELECT Count()
            FROM Idea__c
            WHERE Category__c='MarTech'
            AND Status__c='In Production'
        ];
    }
}