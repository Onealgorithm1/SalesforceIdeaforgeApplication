import { LightningElement, api } from 'lwc';

export default class ReplyItem extends LightningElement {

    @api reply;

    isExpanded = true;

    get toggleIcon() {

        return this.isExpanded ? '-' : '+';

    }

    handleReplyClick() {

        this.dispatchEvent(
            new CustomEvent(
                'replyclick',
                {
                    detail: {
                        replyId: this.reply.Id
                    },
                    bubbles: true,
                    composed: true
                }
            )
        );

    }

    handleToggle(){

        this.isExpanded =
            !this.isExpanded;

    }
    handleUpvote(){

    this.dispatchEvent(
        new CustomEvent(
            'replyupvote',
            {
                detail:{
                    replyId:this.reply.Id
                },
                bubbles:true,
                composed:true
            }
        )
    );

}

    bubbleReply(event){

        event.stopPropagation();

        this.dispatchEvent(
            new CustomEvent(
                'replyclick',
                {
                    detail: event.detail,
                    bubbles: true,
                    composed: true
                }
            )
        );

    }
    bubbleUpvote(event) {

    event.stopPropagation();

    this.dispatchEvent(
        new CustomEvent(
            'replyupvote',
            {
                detail: event.detail,
                bubbles: true,
                composed: true
            }
        )
    );

}

}