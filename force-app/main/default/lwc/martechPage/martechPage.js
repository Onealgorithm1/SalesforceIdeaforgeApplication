import { LightningElement, wire, track } from 'lwc';

import getIdeas from '@salesforce/apex/MartechController.getIdeas';
import getComments from '@salesforce/apex/MartechController.getComments';
import saveComment from '@salesforce/apex/MartechController.saveComment';
import upvoteIdea from '@salesforce/apex/MartechController.upvoteIdea';
import downvoteIdea from '@salesforce/apex/MartechController.downvoteIdea';

export default class MartechPage extends LightningElement {

    @track ideas = [];
    @track comments = [];
    @track selectedIdea = null;
    @track commentText = '';

    ideaTitle = '';
    selectedStatus = 'Ideation';

    handleTitleChange(event){
        this.ideaTitle = event.target.value;
    }

    @wire(getIdeas)
    wiredIdeas({data,error}){

        if(data){

            this.ideas = data.map(item => {

                return {

                    ...item,

                    commentCount:
                    item.Comments__r ?
                    item.Comments__r.length : 0
                };
            });

        }else if(error){

            console.error(error);
        }
    }

    get filteredIdeas(){

        return this.ideas.filter(
            idea => idea.Status__c === this.selectedStatus
        );
    }

    get ideationCount(){

        return this.ideas.filter(
            idea => idea.Status__c === 'Ideation'
        ).length;
    }

    get developmentCount(){

        return this.ideas.filter(
            idea => idea.Status__c === 'In Development'
        ).length;
    }

    get productionCount(){

        return this.ideas.filter(
            idea => idea.Status__c === 'In Production'
        ).length;
    }

    showIdeation(){
        this.selectedStatus = 'Ideation';
    }

    showDevelopment(){
        this.selectedStatus = 'In Development';
    }

    showProduction(){
        this.selectedStatus = 'In Production';
    }

    openNewIdea(){

        this.dispatchEvent(

            new CustomEvent('newidea', {

                detail : {

                    title : this.ideaTitle
                }
            })
        );
    }

    openIdea(event){

        const ideaId =
        event.currentTarget.dataset.id;

        this.selectedIdea =
        this.ideas.find(
            item => item.Id === ideaId
        );

        this.loadComments();
    }

    closeDetails(){

        this.selectedIdea = null;
        this.comments = [];
        this.commentText = '';
    }

    loadComments(){

        getComments({

            ideaId : this.selectedIdea.Id

        })
        .then(result => {

            this.comments = result;

        })
        .catch(error => {

            console.error(error);
        });
    }

    handleCommentChange(event){

        this.commentText =
        event.target.value;
    }

    submitComment(){

        if(!this.commentText){

            return;
        }

        saveComment({

            ideaId : this.selectedIdea.Id,
            commentText : this.commentText

        })
        .then(() => {

            this.commentText = '';

            const box =
            this.template.querySelector(
                '.comment-textarea'
            );

            if(box){

                box.value = '';
            }

            this.loadComments();

        })
        .catch(error => {

            console.error(error);
        });
    }

    handleVote(event){

        event.stopPropagation();

        const ideaId =
        event.currentTarget.dataset.id;

        const action =
        event.currentTarget.dataset.action;

        if(action === 'upvote'){

            upvoteIdea({

                ideaId : ideaId

            })
            .then(total => {

                this.updateVoteCount(
                    ideaId,
                    total
                );
            });
        }

        if(action === 'downvote'){

            downvoteIdea({

                ideaId : ideaId

            })
            .then(total => {

                this.updateVoteCount(
                    ideaId,
                    total
                );
            });
        }
    }

    updateVoteCount(
        ideaId,
        total
    ){

        this.ideas =
        this.ideas.map(item => {

            if(item.Id === ideaId){

                return {

                    ...item,

                    Votes__c : total
                };
            }

            return item;
        });
    }
}