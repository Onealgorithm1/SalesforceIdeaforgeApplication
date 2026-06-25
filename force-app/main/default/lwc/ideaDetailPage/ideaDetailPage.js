import { LightningElement, api, wire, track } from 'lwc';

import getIdeaDetails
from '@salesforce/apex/IdeaDetailController.getIdeaDetails';

import getComments
from '@salesforce/apex/IdeaDetailController.getComments';

import saveComment
from '@salesforce/apex/IdeaDetailController.saveComment';
import getReplies
from '@salesforce/apex/IdeaDetailController.getReplies';

import saveReply
from '@salesforce/apex/IdeaDetailController.saveReply';
import upvoteComment
from '@salesforce/apex/IdeaDetailController.upvoteComment';
import upvoteReply
from '@salesforce/apex/IdeaDetailController.upvoteReply';
import saveReplyToReply
from '@salesforce/apex/IdeaDetailController.saveReplyToReply';

export default class IdeaDetailPage extends LightningElement {

    @api ideaId;

    @track idea;

    @track comments = [];
    commentText = '';
    nestedReplyText = '';
    selectedReplyId = null;
    replyText = {};
    showReplyBox = {};
    get authorName() {

    return this.idea?.CreatedBy?.Name || '';

}

    @wire(getIdeaDetails,
        {
            ideaId: '$ideaId'
        }
    )
    wiredIdea({ data, error }) {

    console.log('Idea Id => ', this.ideaId);

    if(data){

        console.log(JSON.stringify(data));

        this.idea = data;

    }

    if(error){

        console.log(JSON.stringify(error));

    }

}
    connectedCallback(){

        this.loadComments();

    }
    goBack() {

    this.dispatchEvent(
        new CustomEvent('back')
    );

}

async loadComments() {

    try {

        const commentsResult = await getComments({
            ideaId: this.ideaId
        });

        const comments = [];

        for(const comment of commentsResult){

            const replyResult = await getReplies({
                commentId: comment.Id
            });

            const replyMap = {};

            replyResult.forEach(reply => {

                replyMap[reply.Id] = {
                    ...reply,
                   childReplies: [],
                    isExpanded: true,
                    toggleIcon: '-',
                    showReplyBox: false,
                    showReplies: true
                };

            });

            const rootReplies = [];

            replyResult.forEach(reply => {

                if(reply.Parent_Reply__c){

                    const parent =
                        replyMap[reply.Parent_Reply__c];

                    if(parent){

                        parent.childReplies.push(
                            replyMap[reply.Id]
                        );

                    }

                } else {

                    rootReplies.push(
                        replyMap[reply.Id]
                    );

                }

            });

            comments.push({

                ...comment,

                replies: rootReplies,

                showReplyBox: false,
                showReplies: true,
                subCommentToggleIcon: '-',
                isCommentExpanded: true,
                commentToggleIcon: '-'

            });

        }

        this.comments = comments;

    } catch(error){

        console.log(error);

    }

}
handleNestedReplyChange(event){

    this.nestedReplyText =
        event.target.value;

}
handleReplyClick(event){

    this.selectedReplyId =
        event.detail.replyId;

    console.log(
        'Reply Clicked:',
        this.selectedReplyId
    );

}

    handleCommentChange(event){

    this.commentText = event.target.value;

}

    submitComment() {

    if (!this.commentText) {
        return;
    }

    const commentValue = this.commentText;

    saveComment({

        ideaId: this.ideaId,
        commentText: commentValue

    })
    .then(result => {

    result.replies = [];
result.showReplyBox = false;

result.showReplies = true;
result.subCommentToggleIcon = '-';

result.isCommentExpanded = true;
result.commentToggleIcon = '-';

    this.comments = [
        result,
        ...this.comments
    ];

    this.commentText = '';

    const textarea =
        this.template.querySelector(
            '.comment-box'
        );

    if(textarea){
        textarea.value = '';
    }

})

}
toggleReply(event) {

    const commentId =
        event.target.dataset.id;

    this.comments =
        this.comments.map(comment => {

            if(comment.Id === commentId){

                return {

                    ...comment,

                    showReplyBox:
                        !comment.showReplyBox

                };

            }

            return comment;

        });

}toggleComment(event) {

    const commentId =
        event.target.dataset.id;

    this.comments =
        this.comments.map(comment => {

            if(comment.Id === commentId){

                const expanded =
                    !comment.isCommentExpanded;

                return {

                    ...comment,

                    isCommentExpanded:
                        expanded,

                    commentToggleIcon:
                        expanded
                        ? '-'
                        : '+'

                };

            }

            return comment;

        });

}
toggleSubComments(event) {

    const commentId =
        event.target.dataset.id;

    this.comments =
        this.comments.map(comment => {

            if(comment.Id === commentId){

                const show =
                    !comment.showReplies;

                return {

                    ...comment,

                    showReplies: show,

                    subCommentToggleIcon:
                        show
                        ? '-'
                        : '+'

                };

            }

            return comment;

        });

}
handleCommentUpvote(event) {

    const commentId =
        event.target.dataset.id;

    upvoteComment({

        commentId: commentId

    })
    .then(total => {

        this.comments =
            this.comments.map(comment => {

                if(comment.Id === commentId){

                    return {

                        ...comment,

                        Upvotes__c: total

                    };

                }

                return comment;

            });

    })
    .catch(error => {

        console.log(error);

    });

}
handleReplyChange(event){

    const commentId =
        event.target.dataset.id;

    this.replyText = {

        ...this.replyText,

        [commentId]:
        event.target.value

    };

}

handleReplyUpvote(event) {

    const replyId = event.detail.replyId;

    upvoteReply({
        replyId
    })
    .then(total => {

        const updateReplies = replies => {

            return replies.map(reply => {

                if(reply.Id === replyId){

                    return {
                        ...reply,
                        Upvotes__c: total
                    };
                }

                return {
                    ...reply,
                    childReplies:
                        reply.childReplies
                        ? updateReplies(reply.childReplies)
                        : []
                };
            });
        };

        this.comments =
            this.comments.map(comment => {

                return {
                    ...comment,
                    replies:
                        updateReplies(
                            comment.replies || []
                        )
                };
            });

    });

}async postReplyToReply() {

    try {

        const result = await saveReplyToReply({
            parentReplyId: this.selectedReplyId,
            replyText: this.nestedReplyText
        });

        console.log('Child Reply Saved', result);

        this.selectedReplyId = null;
        this.nestedReplyText = '';

        await this.loadComments();

        // Force LWC re-render
        this.comments = JSON.parse(
            JSON.stringify(this.comments)
        );

        console.log(
            'Comments After Reload',
            JSON.stringify(this.comments)
        );

    } catch(error) {

        console.error(error);

    }

}
get totalDiscussionCount() {

    let total = this.comments.length;

    const countChildren = (replies) => {

        replies.forEach(reply => {

            total++;

            if(reply.childReplies){

                countChildren(
                    reply.childReplies
                );

            }

        });

    };

    this.comments.forEach(comment => {

        countChildren(
            comment.replies || []
        );

    });

    return total;

}
postReply(event) {

    const commentId =
        event.target.dataset.id;

    saveReply({

        commentId: commentId,

        replyText:
            this.replyText[commentId]

    })
    .then(result => {

        console.log(
            'Reply Returned =>',
            JSON.stringify(result)
        );

        this.comments =
            this.comments.map(c => {

                if(c.Id === commentId){

                    return {

                        ...c,

                        showReplyBox: false,

                        replies: [

    ...(c.replies || []),

    {
        ...result,
        isExpanded: true,
        toggleIcon: '-'
    }

]
                    };

                }

                return c;

            });

        this.replyText = {

            ...this.replyText,

            [commentId]: ''

        };

    })
    .catch(error => {

        console.log(error);

    });

}
}