import { LightningElement, wire, track } from 'lwc';

import getUIIdeas
    from '@salesforce/apex/UiRoadmapController.getUIIdeas';

import updateIdeaStatus
    from '@salesforce/apex/UiRoadmapController.updateIdeaStatus';

import getComments
    from '@salesforce/apex/UiRoadmapController.getComments';

import addComment
    from '@salesforce/apex/UiRoadmapController.addComment';

import likeIdea
    from '@salesforce/apex/UiRoadmapController.likeIdea';

import unlikeIdea
    from '@salesforce/apex/UiRoadmapController.unlikeIdea';

export default class UiPage extends LightningElement {

    @track ideas = [];
    @track selectedIdea = null;
    @track comments = [];
    @track commentText = '';
    draggedIdeaId;

    @wire(getUIIdeas)
    wiredIdeas({ data, error }) {

        if (data) {

            this.ideas = data;

        } else if (error) {

            console.error(error);
        }
    }

    get ideationIdeas() {

        return this.ideas.filter(
            idea => idea.Status__c === 'Ideation'
        );
    }

    get developmentIdeas() {

        return this.ideas.filter(
            idea => idea.Status__c === 'In Development'
        );
    }

    get qaIdeas() {

        return this.ideas.filter(
            idea => idea.Status__c === 'QA & Testing'
        );
    }

    get productionIdeas() {

        return this.ideas.filter(
            idea => idea.Status__c === 'In Production'
        );
    }

    openIdea(event) {

        const ideaId =
            event.currentTarget.dataset.id;

        this.selectedIdea =
            this.ideas.find(
                idea => idea.Id === ideaId
            );

        getComments({
            ideaId: ideaId
        })
        .then(result => {

            this.comments = result;

        })
        .catch(error => {

            console.error(error);

        });
    }

    closeDetails() {

        this.selectedIdea = null;
    }

    handleDragStart(event) {

        this.draggedIdeaId =
            event.currentTarget.dataset.id;

        event.dataTransfer.setData(
            'text/plain',
            this.draggedIdeaId
        );
    }

    allowDrop(event) {

        event.preventDefault();
    }

    handleDragEnter(event) {

        event.currentTarget.classList.add(
            'drag-hover'
        );
    }

    handleDragLeave(event) {

        event.currentTarget.classList.remove(
            'drag-hover'
        );
    }

    handleDrop(event) {

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

        this.ideas =
            this.ideas.map(idea => {

                if (idea.Id === draggedIdeaId) {

                    return {
                        ...idea,
                        Status__c: newStatus
                    };
                }

                return idea;
            });

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

            console.error(error);

        });
    }

    handleCommentChange(event) {

        this.commentText =
            event.target.value;
    }

    submitComment() {

        if (!this.commentText) {

            return;
        }

        addComment({

            ideaId: this.selectedIdea.Id,
            txt: this.commentText

        })
        .then(() => {

            this.commentText = '';

            const textarea =
                this.template.querySelector(
                    '.comment-box'
                );

            if (textarea) {

                textarea.value = '';
            }

            return getComments({

                ideaId:
                    this.selectedIdea.Id

            });
        })
        .then(result => {

            this.comments = result;

            this.ideas =
                this.ideas.map(idea => {

                    if (
                        idea.Id ===
                        this.selectedIdea.Id
                    ) {

                        return {

                            ...idea,

                            commentCount:
                                result.length
                        };
                    }

                    return idea;
                });
        })
        .catch(error => {

            console.error(error);

        });
    }

    handleVote(event) {

        event.preventDefault();
        event.stopPropagation();

        const ideaId =
            event.currentTarget.dataset.id;

        const action =
            event.currentTarget.dataset.action;

        if (action === 'upvote') {

            likeIdea({

                ideaId: ideaId

            })
            .then(() => {

                return getUIIdeas();

            })
            .then(result => {

                this.ideas = result;

            })
            .catch(error => {

                console.error(error);

            });
        }

        if (action === 'downvote') {

            unlikeIdea({

                ideaId: ideaId

            })
            .then(() => {

                return getUIIdeas();

            })
            .then(result => {

                this.ideas = result;

            })
            .catch(error => {

                console.error(error);

            });
        }
    }
}