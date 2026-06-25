import { LightningElement, wire, track } from 'lwc';

import getSalesforceIdeas
    from '@salesforce/apex/SalesforceRoadmapController.getSalesforceIdeas';

import updateIdeaStatus
    from '@salesforce/apex/SalesforceRoadmapController.updateIdeaStatus';

import getComments
    from '@salesforce/apex/SalesforceRoadmapController.getComments';

import addComment
    from '@salesforce/apex/SalesforceRoadmapController.addComment';

import likeIdea
    from '@salesforce/apex/SalesforceRoadmapController.likeIdea';

import unlikeIdea
    from '@salesforce/apex/SalesforceRoadmapController.unlikeIdea';

export default class SalesforcePage extends LightningElement {

    @track ideas = [];
    @track selectedIdea = null;
    @track comments = [];
    @track commentText = '';

    draggedIdeaId;

    @wire(getSalesforceIdeas)
    wiredIdeas({ data, error }) {

        if (data) {

            this.ideas = data.map(idea => {
                return {
                    ...idea,
                    commentCount:
                        idea.commentCount
                            ? idea.commentCount
                            : 0
                };
            });

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
                item => item.Id === ideaId
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

        event.dataTransfer.effectAllowed = 'move';

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

        this.ideas = this.ideas.map(
            idea => {

                if (
                    idea.Id === draggedIdeaId
                ) {

                    return {
                        ...idea,
                        Status__c: newStatus
                    };
                }

                return idea;
            }
        );

        updateIdeaStatus({

            ideaId: draggedIdeaId,
            newStatus: newStatus

        })
        .then(() => {

            console.log(
                'Status Updated'
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

            this.comments = [...result];

            this.ideas = this.ideas.map(
                idea => {

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
                }
            );

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

        if (
            action === 'upvote'
        ) {

            likeIdea({

                ideaId: ideaId

            })
            .then(() => {

                this.ideas =
                    this.ideas.map(
                        idea => {

                            if (
                                idea.Id ===
                                ideaId
                            ) {

                                return {

                                    ...idea,

                                    Points__c:
                                        (idea.Points__c || 0) + 10,

                                    Likes__c:
                                        (idea.Likes__c || 0) + 1
                                };
                            }

                            return idea;
                        }
                    );

            })
            .catch(error => {

                console.error(error);

            });

        }

        if (
            action === 'downvote'
        ) {

            unlikeIdea({

                ideaId: ideaId

            })
            .then(() => {

                this.ideas =
                    this.ideas.map(
                        idea => {

                            if (
                                idea.Id ===
                                ideaId
                            ) {

                                return {

                                    ...idea,

                                    Points__c:
                                        Math.max(
                                            0,
                                            (idea.Points__c || 0) - 10
                                        ),

                                    Likes__c:
                                        Math.max(
                                            0,
                                            (idea.Likes__c || 0) - 1
                                        )
                                };
                            }

                            return idea;
                        }
                    );

            })
            .catch(error => {

                console.error(error);

            });
        }
    }
}