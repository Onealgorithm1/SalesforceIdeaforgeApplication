import { LightningElement, wire, track } from 'lwc';

import { NavigationMixin } from 'lightning/navigation';

import getIdeas from '@salesforce/apex/OverviewController.getIdeas';

import upvoteIdea from '@salesforce/apex/IdeaController.upvoteIdea';

import downvoteIdea from '@salesforce/apex/IdeaController.downvoteIdea';

export default class OverviewPage extends NavigationMixin(LightningElement) {

    @track ideas = [];

    selectedStatus = 'Ideation';

    @wire(getIdeas)
    wiredIdeas({ data, error }) {

        if(data){

            this.ideas = data.map(item => {

                return {

                    ...item,

                    commentCount:
                        item.Comments__r
                        ? item.Comments__r.length
                        : 0

                };

            });

        }
        else if(error){

            console.error(error);

        }

    }

    get filteredIdeas(){

        return this.ideas.filter(
            item =>
            item.Status__c === this.selectedStatus
        );

    }

    get ideationCount(){

        return this.ideas.filter(
            item =>
            item.Status__c === 'Ideation'
        ).length;

    }

    get developmentCount(){

        return this.ideas.filter(
            item =>
            item.Status__c === 'In Development'
        ).length;

    }

    get productionCount(){

        return this.ideas.filter(
            item =>
            item.Status__c === 'In Production'
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

    // OPEN NEW IDEA PAGE

    openNewIdea(){

        this[NavigationMixin.Navigate]({

            type: 'comm__namedPage',

            attributes: {

                name: 'New_Idea__c'

            }

        });

    }

    // OPEN IDEA DETAIL PAGE

    openIdea(event){

        const ideaId =
            event.currentTarget.dataset.id;

        this[NavigationMixin.Navigate]({

            type: 'standard__recordPage',

            attributes: {

                recordId: ideaId,

                objectApiName: 'Idea__c',

                actionName: 'view'

            }

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
                ideaId: ideaId
            })
            .then(result => {

                this.updateVotes(
                    ideaId,
                    result
                );

            });

        }

        if(action === 'downvote'){

            downvoteIdea({
                ideaId: ideaId
            })
            .then(result => {

                this.updateVotes(
                    ideaId,
                    result
                );

            });

        }

    }

    updateVotes(
        ideaId,
        total
    ){

        this.ideas =
            this.ideas.map(item => {

                if(item.Id === ideaId){

                    return {

                        ...item,

                        Votes__c: total

                    };

                }

                return item;

            });

    }
    handleNewEvent() {

    this.dispatchEvent(
        new CustomEvent('newevent')
    );

}

}