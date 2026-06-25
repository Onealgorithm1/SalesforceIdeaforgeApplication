public with sharing class IdeaController {

    /* CREATE IDEA */

    @AuraEnabled
public static Id createIdea(
    String title,
    String description,
    String category,
    String ideaSpace
){

    Idea__c newIdea = new Idea__c();

    newIdea.Name = title;
    newIdea.Description__c = description;
    newIdea.Category__c = category;
    newIdea.Idea_Space__c = ideaSpace;
    newIdea.Status__c = 'Ideation';
    newIdea.Votes__c = 0;

    insert newIdea;

    return newIdea.Id;
}
    /* FETCH IDEAS */

    @AuraEnabled(cacheable=true)

    public static List<Idea__c> getIdeas(){

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

            ORDER BY CreatedDate DESC

        ];

    }

    /* UPDATE IDEA STATUS */

    @AuraEnabled

    public static void updateIdeaStatus(

        Id ideaId,
        String newStatus

    ){

        Idea__c idea = [

            SELECT
                Id,
                Status__c

            FROM Idea__c

            WHERE Id = :ideaId

            LIMIT 1
        ];

        idea.Status__c = newStatus;

        update idea;

    }

    /* SAVE COMMENT */

    @AuraEnabled

    public static void saveComment(

        Id ideaId,
        String commentText

    ){

        Comment__c newComment = new Comment__c();

        newComment.Idea__c = ideaId;

        newComment.Comment_Text__c = commentText;

        insert newComment;

    }

    /* FETCH COMMENTS */

    @AuraEnabled(cacheable=true)

    public static List<Comment__c> getComments(

        Id ideaId

    ){

        return [

            SELECT
                Id,
                Comment_Text__c,
                CreatedDate

            FROM Comment__c

            WHERE Idea__c = :ideaId

            ORDER BY CreatedDate DESC

        ];

    }

    /* UPVOTE */

    @AuraEnabled

    public static Integer upvoteIdea(

        Id ideaId

    ){

        Id currentUserId = UserInfo.getUserId();

        /* CHECK EXISTING VOTE */

        List<Vote__c> existingVotes = [

            SELECT
                Id,
                Vote_Type__c

            FROM Vote__c

            WHERE Idea__c = :ideaId
            AND User__c = :currentUserId

            LIMIT 1
        ];

        /* ALREADY UPVOTED */

        if(

            !existingVotes.isEmpty()

            &&

            existingVotes[0].Vote_Type__c == 'Upvote'

        ){

            Idea__c existingIdea = [

                SELECT Votes__c

                FROM Idea__c

                WHERE Id = :ideaId

                LIMIT 1
            ];

            return Integer.valueOf(

                existingIdea.Votes__c

            );

        }

        /* UPDATE EXISTING */

        if(!existingVotes.isEmpty()){

            existingVotes[0].Vote_Type__c = 'Upvote';

            update existingVotes[0];

        }

        /* CREATE NEW */

        else{

            Vote__c vote = new Vote__c();

            vote.Idea__c = ideaId;

            vote.User__c = currentUserId;

            vote.Vote_Type__c = 'Upvote';

            insert vote;

        }

        /* RECALCULATE */

        Integer total = 0;

        List<Vote__c> allVotes = [

            SELECT Vote_Type__c

            FROM Vote__c

            WHERE Idea__c = :ideaId
        ];

        for(Vote__c v : allVotes){

            if(v.Vote_Type__c == 'Upvote'){

                total++;

            }

            else if(v.Vote_Type__c == 'Downvote'){

                total--;

            }

        }

        Idea__c idea = [

            SELECT
                Id,
                Votes__c

            FROM Idea__c

            WHERE Id = :ideaId

            LIMIT 1
        ];

        idea.Votes__c = total;

        update idea;

        return total;

    }

    /* DOWNVOTE */

    @AuraEnabled

    public static Integer downvoteIdea(

        Id ideaId

    ){

        Id currentUserId = UserInfo.getUserId();

        /* CHECK EXISTING VOTE */

        List<Vote__c> existingVotes = [

            SELECT
                Id,
                Vote_Type__c

            FROM Vote__c

            WHERE Idea__c = :ideaId
            AND User__c = :currentUserId

            LIMIT 1
        ];

        /* ALREADY DOWNVOTED */

        if(

            !existingVotes.isEmpty()

            &&

            existingVotes[0].Vote_Type__c == 'Downvote'

        ){

            Idea__c existingIdea = [

                SELECT Votes__c

                FROM Idea__c

                WHERE Id = :ideaId

                LIMIT 1
            ];

            return Integer.valueOf(

                existingIdea.Votes__c

            );

        }

        /* UPDATE EXISTING */

        if(!existingVotes.isEmpty()){

            existingVotes[0].Vote_Type__c = 'Downvote';

            update existingVotes[0];

        }

        /* CREATE NEW */

        else{

            Vote__c vote = new Vote__c();

            vote.Idea__c = ideaId;

            vote.User__c = currentUserId;

            vote.Vote_Type__c = 'Downvote';

            insert vote;

        }

        /* RECALCULATE */

        Integer total = 0;

        List<Vote__c> allVotes = [

            SELECT Vote_Type__c

            FROM Vote__c

            WHERE Idea__c = :ideaId
        ];

        for(Vote__c v : allVotes){

            if(v.Vote_Type__c == 'Upvote'){

                total++;

            }

            else if(v.Vote_Type__c == 'Downvote'){

                total--;

            }

        }

        Idea__c idea = [

            SELECT
                Id,
                Votes__c

            FROM Idea__c

            WHERE Id = :ideaId

            LIMIT 1
        ];

        idea.Votes__c = total;

        update idea;

        return total;

    }

}