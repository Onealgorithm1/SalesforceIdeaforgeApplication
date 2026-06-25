public with sharing class IdeaDetailController {

    @AuraEnabled(cacheable=true)
    public static Idea__c getIdeaDetails(
        Id ideaId
    ){

        return [

            SELECT
                Id,
                Name,
                Description__c,
                Votes__c,
                CreatedBy.Name

            FROM Idea__c

            WHERE Id=:ideaId

            LIMIT 1

        ];

    }
@AuraEnabled
public static Integer upvoteReply(Id replyId) {

    Comment_Reply__c reply = [

        SELECT Id, Upvotes__c
        FROM Comment_Reply__c
        WHERE Id = :replyId
        LIMIT 1

    ];

    if(reply.Upvotes__c == null){

        reply.Upvotes__c = 0;

    }

    reply.Upvotes__c++;

    update reply;

    return Integer.valueOf(reply.Upvotes__c);

}
    @AuraEnabled
    public static List<Comment__c> getComments(
        Id ideaId
    ){

        return [

            SELECT
    Id,
    Comment_Text__c,
    CreatedBy.Name,
    CreatedDate,
    Upvotes__c
FROM Comment__c
WHERE Idea__c = :ideaId
ORDER BY CreatedDate DESC

        ];

    }
@AuraEnabled
public static List<Comment_Reply__c> getReplies(
    Id commentId
){

    return [

        SELECT
    Id,
    Reply_Text__c,
    Upvotes__c,
    CreatedBy.Name,
    CreatedDate,
    Comment__c,
    Parent_Reply__c
FROM Comment_Reply__c
WHERE Comment__c = :commentId
ORDER BY CreatedDate ASC

    ];
} 
@AuraEnabled
public static Comment_Reply__c saveReplyToReply(
    Id parentReplyId,
    String replyText
){

    Comment_Reply__c parentReply = [

        SELECT Id, Comment__c
        FROM Comment_Reply__c
        WHERE Id = :parentReplyId
        LIMIT 1

    ];

    Comment_Reply__c childReply =
        new Comment_Reply__c();

    childReply.Comment__c =
        parentReply.Comment__c;

    childReply.Parent_Reply__c =
        parentReplyId;

    childReply.Reply_Text__c =
        replyText;

    childReply.Upvotes__c = 0;

    try{
    insert childReply;
}
catch(Exception e){
    System.debug('ERROR: ' + e.getMessage());
    throw e;
}

    return [

        SELECT
            Id,
            Reply_Text__c,
            Upvotes__c,
            Parent_Reply__c,
            CreatedBy.Name

        FROM Comment_Reply__c

        WHERE Id = :childReply.Id
    ];
}
@AuraEnabled
public static Integer upvoteComment(Id commentId) {

    Comment__c commentRecord = [

        SELECT Id, Upvotes__c
        FROM Comment__c
        WHERE Id = :commentId
        LIMIT 1
    ];

    if(commentRecord.Upvotes__c == null){

        commentRecord.Upvotes__c = 0;

    }

    commentRecord.Upvotes__c++;

    update commentRecord;

    return Integer.valueOf(commentRecord.Upvotes__c);

}
@AuraEnabled
public static Comment_Reply__c saveReply(

    Id commentId,

    String replyText

){

    Comment_Reply__c replyRec =
        new Comment_Reply__c();

    replyRec.Comment__c =
        commentId;

    replyRec.Reply_Text__c =
        replyText;

    replyRec.Upvotes__c = 0;

    insert replyRec;

    return [

        SELECT
            Id,
            Reply_Text__c,
            Upvotes__c,
            CreatedBy.Name
        FROM Comment_Reply__c
        WHERE Id=:replyRec.Id
    ];
}
    @AuraEnabled
public static Comment__c saveComment(
    Id ideaId,
    String commentText
){
    Comment__c c = new Comment__c();

    c.Idea__c = ideaId;
    c.Comment_Text__c = commentText;
    c.Upvotes__c = 0;

    insert c;

    return [

        SELECT
            Id,
            Comment_Text__c,
            Upvotes__c,
            CreatedBy.Name
        FROM Comment__c
        WHERE Id = :c.Id

    ];
}

}