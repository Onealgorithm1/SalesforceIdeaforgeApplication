import { LightningElement, track, wire } from 'lwc';

import getProductIdeas
from '@salesforce/apex/ProductRoadmapController.getProductIdeas';

import updateIdeaStatus
from '@salesforce/apex/ProductRoadmapController.updateIdeaStatus';

import likeIdea
from '@salesforce/apex/ProductRoadmapController.likeIdea';

import unlikeIdea
from '@salesforce/apex/ProductRoadmapController.unlikeIdea';

import getComments
from '@salesforce/apex/ProductRoadmapController.getComments';

import addComment
from '@salesforce/apex/ProductRoadmapController.addComment';

export default class ProductRoadmap extends LightningElement {

    @track ideas = [];
    @track selectedIdea;
    @track comments = [];
    @track commentText = '';
    draggedIdeaId;

    @wire(getProductIdeas)
    wiredIdeas({data,error}){

        if(data){

            this.ideas = data;
        }

        if(error){

            console.error(error);
        }
    }

    get ideationIdeas(){

        return this.ideas.filter(
            x => x.Status__c === 'Ideation'
        );
    }

    get developmentIdeas(){

        return this.ideas.filter(
            x => x.Status__c === 'In Development'
        );
    }

    get qaIdeas(){

        return this.ideas.filter(
            x => x.Status__c === 'QA & Testing'
        );
    }

    get productionIdeas(){

        return this.ideas.filter(
            x => x.Status__c === 'In Production'
        );
    }

    handleDragStart(event){

        this.draggedIdeaId =
            event.currentTarget.dataset.id;
    }

    allowDrop(event){

        event.preventDefault();
    }

    handleDrop(event){

        event.preventDefault();

        const newStatus =
            event.currentTarget.dataset.status;

        updateIdeaStatus({

            ideaId: this.draggedIdeaId,
            newStatus: newStatus

        })
        .then(() => {

            this.ideas = this.ideas.map(i => {

                if(i.Id === this.draggedIdeaId){

                    return {
                        ...i,
                        Status__c: newStatus
                    };
                }

                return i;
            });
        });
    }

    openIdea(event){

        const id =
            event.currentTarget.dataset.id;

        this.selectedIdea =
            this.ideas.find(x => x.Id === id);

        getComments({
            ideaId:id
        })
        .then(result => {

            this.comments = result;
        });
    }

    closeDetails(){

        this.selectedIdea = null;
    }

    handleCommentChange(event){

        this.commentText = event.target.value;
    }

    submitComment(){

        if(!this.commentText){

            return;
        }

        addComment({

            ideaId:this.selectedIdea.Id,
            txt:this.commentText

        })
        .then(() => {

            return getComments({

                ideaId:this.selectedIdea.Id

            });
        })
        .then(result => {

            this.comments = result;
            this.commentText = '';
        });
    }

    handleLike(event){

        const id =
            event.currentTarget.dataset.id;

        likeIdea({

            ideaId:id

        })
        .then(() => {

            window.location.reload();
        });
    }

    handleUnlike(event){

        const id =
            event.currentTarget.dataset.id;

        unlikeIdea({

            ideaId:id

        })
        .then(() => {

            window.location.reload();
        });
    }
}