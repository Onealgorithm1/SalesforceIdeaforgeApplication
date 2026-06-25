import { LightningElement, track } from 'lwc';

import getBugIdeas from '@salesforce/apex/BugsRoadmapController.getBugIdeas';
import updateIdeaStatus from '@salesforce/apex/BugsRoadmapController.updateIdeaStatus';
import getComments from '@salesforce/apex/BugsRoadmapController.getComments';
import addComment from '@salesforce/apex/BugsRoadmapController.addComment';

export default class BugsPage extends LightningElement {

    @track ideas = [];
    @track selectedIdea;
    @track comments = [];
    @track commentText = '';

    connectedCallback() {
        this.loadIdeas();
    }

    loadIdeas() {

        getBugIdeas()
        .then(result => {
            this.ideas = result;
        })
        .catch(error => {
            console.error(error);
        });
    }

    get ideationIdeas() {
        return this.ideas.filter(
            x => x.Status__c === 'Ideation'
        );
    }

    get developmentIdeas() {
        return this.ideas.filter(
            x => x.Status__c === 'In Development'
        );
    }

    get qaIdeas() {
        return this.ideas.filter(
            x => x.Status__c === 'QA & Testing'
        );
    }

    get productionIdeas() {
        return this.ideas.filter(
            x => x.Status__c === 'In Production'
        );
    }

    handleDragStart(event){
        event.dataTransfer.setData(
            'text',
            event.currentTarget.dataset.id
        );
    }

    allowDrop(event){
        event.preventDefault();
    }

    handleDrop(event){

        event.preventDefault();

        const ideaId =
            event.dataTransfer.getData('text');

        const newStatus =
            event.currentTarget.dataset.status;

        updateIdeaStatus({
            ideaId: ideaId,
            newStatus: newStatus
        })
        .then(() => {
            this.loadIdeas();
        });
    }

    openIdea(event){

        const id =
            event.currentTarget.dataset.id;

        this.selectedIdea =
            this.ideas.find(x => x.Id === id);

        getComments({
            ideaId: id
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

        addComment({
            ideaId: this.selectedIdea.Id,
            commentText: this.commentText
        })
        .then(() => {

            this.commentText = '';

            return getComments({
                ideaId: this.selectedIdea.Id
            });
        })
        .then(result => {
            this.comments = result;
        });
    }

    handleLike(event){

        likeIdea({
            ideaId: event.currentTarget.dataset.id
        })
        .then(() => {
            this.loadIdeas();
        });
    }

    handleUnlike(event){

        unlikeIdea({
            ideaId: event.currentTarget.dataset.id
        })
        .then(() => {
            this.loadIdeas();
        });
    }
}