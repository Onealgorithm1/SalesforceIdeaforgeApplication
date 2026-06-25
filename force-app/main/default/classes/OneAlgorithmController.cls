public with sharing class OneAlgorithmController {

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
                Idea_Space__c,
                CreatedDate,
                CreatedById,
                CreatedBy.Name,
                (SELECT Id FROM Comments__r)

            FROM Idea__c

            WHERE Idea_Space__c = 'OneAlgorithm'

            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled
    public static void saveIdea(
        String title,
        String description,
        String category
    ) {

        Idea__c idea = new Idea__c();

        idea.Name = title;
        idea.Description__c = description;
        idea.Category__c = category;
        idea.Status__c = 'Ideation';
        idea.Idea_Space__c = 'OneAlgorithm';
        idea.Votes__c = 0;

        insert idea;
    }

    @AuraEnabled(cacheable=true)
    public static List<Comment__c> getComments(Id ideaId) {

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
    ) {

        Comment__c commentRecord =
            new Comment__c();

        commentRecord.Idea__c =
            ideaId;

        commentRecord.Comment_Text__c =
            commentText;

        insert commentRecord;
    }

    @AuraEnabled
    public static Integer upvoteIdea(
        Id ideaId
    ) {

        Idea__c idea = [

            SELECT
                Id,
                Votes__c

            FROM Idea__c

            WHERE Id = :ideaId

            LIMIT 1
        ];

        if(idea.Votes__c == null){

            idea.Votes__c = 0;

        }

        idea.Votes__c =
            idea.Votes__c + 10;

        update idea;

        return Integer.valueOf(
            idea.Votes__c
        );
    }

    @AuraEnabled
    public static Integer downvoteIdea(
        Id ideaId
    ) {

        Idea__c idea = [

            SELECT
                Id,
                Votes__c

            FROM Idea__c

            WHERE Id = :ideaId

            LIMIT 1
        ];

        if(idea.Votes__c == null){

            idea.Votes__c = 0;

        }

        idea.Votes__c =
            idea.Votes__c - 10;

        update idea;

        return Integer.valueOf(
            idea.Votes__c
        );
    }

    @AuraEnabled(cacheable=true)
    public static Integer getIdeationCount() {

        return [

            SELECT Count()

            FROM Idea__c

            WHERE Idea_Space__c = 'OneAlgorithm'
            AND Status__c = 'Ideation'
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Integer getDevelopmentCount() {

        return [

            SELECT Count()

            FROM Idea__c

            WHERE Idea_Space__c = 'OneAlgorithm'
            AND Status__c = 'In Development'
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Integer getProductionCount() {

        return [

            SELECT Count()

            FROM Idea__c

            WHERE Idea_Space__c = 'OneAlgorithm'
            AND Status__c = 'In Production'
        ];
    }

}