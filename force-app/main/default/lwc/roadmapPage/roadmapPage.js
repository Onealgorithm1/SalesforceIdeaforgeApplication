import { LightningElement, wire, track } from 'lwc';

import getIdeas
from '@salesforce/apex/IdeaController.getIdeas';

import updateIdeaStatus
from '@salesforce/apex/IdeaController.updateIdeaStatus';

import getComments
from '@salesforce/apex/IdeaController.getComments';

import saveComment
from '@salesforce/apex/IdeaController.saveComment';

import upvoteIdea
from '@salesforce/apex/IdeaController.upvoteIdea';

import downvoteIdea
from '@salesforce/apex/IdeaController.downvoteIdea';

export default class RoadmapPage extends LightningElement {

    @track ideas = [];

    @track selectedIdea = null;

    @track draggedIdeaId;

    @track comments = [];

    @track commentText = '';

    /* FETCH IDEAS */

    @wire(getIdeas)

    wiredIdeas({ data, error }){

        if(data){

            this.ideas = data.map(

                idea => {

                    return {

                        ...idea,

                        commentCount:
                            idea.Comments__r
                            ? idea.Comments__r.length
                            : 0

                    };

                }

            );

        }

        else if(error){

            console.log(error);

        }

    }

    /* IDEATION */

    get ideationIdeas(){

        return this.ideas.filter(

            idea => idea.Status__c === 'Ideation'

        );

    }

    /* DEVELOPMENT */

    get developmentIdeas(){

        return this.ideas.filter(

            idea => idea.Status__c === 'In Development'

        );

    }

    /* QA */

    get qaIdeas(){

        return this.ideas.filter(

            idea => idea.Status__c === 'QA & Testing'

        );

    }

    /* PRODUCTION */

    get productionIdeas(){

        return this.ideas.filter(

            idea => idea.Status__c === 'In Production'

        );

    }

    /* OPEN IDEA DETAILS */

    openIdea(event){

        const ideaId = event.currentTarget.dataset.id;

        this.selectedIdea = this.ideas.find(

            idea => idea.Id === ideaId

        );

        /* FETCH COMMENTS */

        getComments({

            ideaId: ideaId

        })

        .then(result => {

            this.comments = result;

        })

        .catch(error => {

            console.log(error);

        });

    }

    /* CLOSE MODAL */

    closeDetails(){

        this.selectedIdea = null;

    }

    /* DRAG START */

    handleDragStart(event){

        this.draggedIdeaId =
            event.currentTarget.dataset.id;

        event.dataTransfer.effectAllowed = 'move';

        event.dataTransfer.setData(

            'text/plain',
            this.draggedIdeaId

        );

    }

    /* ALLOW DROP */

    allowDrop(event){

        event.preventDefault();

    }

    /* DRAG ENTER */

    handleDragEnter(event){

        event.currentTarget.classList.add(

            'drag-hover'

        );

    }

    /* DRAG LEAVE */

    handleDragLeave(event){

        event.currentTarget.classList.remove(

            'drag-hover'

        );

    }

    /* HANDLE DROP */

    handleDrop(event){

        event.preventDefault();

        event.currentTarget.classList.remove(

            'drag-hover'

        );

        const newStatus =
            event.currentTarget.dataset.status;

        const draggedIdeaId =
            event.dataTransfer.getData(

                'text/plain'

            );

        /* IMMUTABLE ARRAY UPDATE */

        this.ideas = this.ideas.map(

            idea => {

                if(idea.Id === draggedIdeaId){

                    return {

                        ...idea,
                        Status__c: newStatus

                    };

                }

                return idea;

            }

        );

        /* SALESFORCE UPDATE */

        updateIdeaStatus({

            ideaId: draggedIdeaId,
            newStatus: newStatus

        })

        .then(() => {

            console.log(

                'Status Updated Successfully'

            );

        })

        .catch(error => {

            console.log(error);

        });

    }

    /* HANDLE COMMENT INPUT */

    handleCommentChange(event){

        this.commentText = event.target.value;

    }

    /* SAVE COMMENT */

    submitComment(){

        if(!this.commentText){

            return;

        }

        saveComment({

            ideaId: this.selectedIdea.Id,
            commentText: this.commentText

        })

        .then(() => {

            /* CLEAR INPUT */

            this.commentText = '';

            /* CLEAR TEXTAREA */

            const textarea = this.template.querySelector(

                '.comment-box'

            );

            if(textarea){

                textarea.value = '';

            }

            /* REFRESH COMMENTS */

            return getComments({

                ideaId: this.selectedIdea.Id

            });

        })

        .then(result => {

            /* REFRESH UI */

            this.comments = [...result];

            /* UPDATE COMMENT COUNT */

            this.ideas = this.ideas.map(

                idea => {

                    if(idea.Id === this.selectedIdea.Id){

                        return {

                            ...idea,

                            commentCount:
                                result.length

                        };

                    }

                    return idea;

                }

            );

        })

        .catch(error => {

            console.log(error);

        });

    }

    /* HANDLE VOTING */

    handleVote(event){

        event.preventDefault();

        event.stopPropagation();

        const ideaId =
            event.currentTarget.dataset.id;

        const action =
            event.currentTarget.dataset.action;

        /* UPVOTE */

        if(action === 'upvote'){

            upvoteIdea({

                ideaId: ideaId

            })

            .then(totalVotes => {

                this.ideas = this.ideas.map(

                    idea => {

                        if(idea.Id === ideaId){

                            return {

                                ...idea,

                                Votes__c: totalVotes

                            };

                        }

                        return idea;

                    }

                );

            })

            .catch(error => {

                console.log(error);

            });

        }

        /* DOWNVOTE */

        else if(action === 'downvote'){

            downvoteIdea({

                ideaId: ideaId

            })

            .then(totalVotes => {

                this.ideas = this.ideas.map(

                    idea => {

                        if(idea.Id === ideaId){

                            return {

                                ...idea,

                                Votes__c: totalVotes

                            };

                        }

                        return idea;

                    }

                );

            })

            .catch(error => {

                console.log(error);

            });

        }

    }

}