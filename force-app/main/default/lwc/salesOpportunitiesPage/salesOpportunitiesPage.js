import { LightningElement, wire, track } from 'lwc';

import getSalesIdeas
    from '@salesforce/apex/SalesOpportunitiesRoadmapController.getSalesIdeas';

import updateIdeaStatus
    from '@salesforce/apex/SalesOpportunitiesRoadmapController.updateIdeaStatus';

import getComments
    from '@salesforce/apex/SalesOpportunitiesRoadmapController.getComments';

import addComment
    from '@salesforce/apex/SalesOpportunitiesRoadmapController.addComment';

import likeIdea
    from '@salesforce/apex/SalesOpportunitiesRoadmapController.likeIdea';

import unlikeIdea
    from '@salesforce/apex/SalesOpportunitiesRoadmapController.unlikeIdea';

export default class SalesOpportunitiesPage extends LightningElement {

    @track ideas = [];
    @track selectedIdea = null;
    @track comments = [];
    @track commentText = '';

    draggedIdeaId;

    // LOAD SALES OPPORTUNITIES IDEAS

    @wire(getSalesIdeas)
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

    // IDEATION

    get ideationIdeas() {

        return this.ideas.filter(
            idea => idea.Status__c === 'Ideation'
        );
    }

    // IN DEVELOPMENT

    get developmentIdeas() {

        return this.ideas.filter(
            idea => idea.Status__c === 'In Development'
        );
    }

    // QA TESTING

    get qaIdeas() {

        return this.ideas.filter(
            idea => idea.Status__c === 'QA & Testing'
        );
    }

    // IN PRODUCTION

    get productionIdeas() {

        return this.ideas.filter(
            idea => idea.Status__c === 'In Production'
        );
    }

    // OPEN IDEA

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

    // CLOSE MODAL

    closeDetails() {

        this.selectedIdea = null;
    }

    // DRAG START

    handleDragStart(event) {

        this.draggedIdeaId =
            event.currentTarget.dataset.id;

        event.dataTransfer.effectAllowed = 'move';

        event.dataTransfer.setData(
            'text/plain',
            this.draggedIdeaId
        );
    }

    // ALLOW DROP

    allowDrop(event) {

        event.preventDefault();
    }

    // DRAG ENTER

    handleDragEnter(event) {

        event.currentTarget.classList.add(
            'drag-hover'
        );
    }

    // DRAG LEAVE

    handleDragLeave(event) {

        event.currentTarget.classList.remove(
            'drag-hover'
        );
    }

    // DROP

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

    // COMMENT CHANGE

    handleCommentChange(event) {

        this.commentText =
            event.target.value;
    }

    // ADD COMMENT

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

    // VOTING

    handleVote(event) {

        event.preventDefault();

        event.stopPropagation();

        const ideaId =
            event.currentTarget.dataset.id;

        const action =
            event.currentTarget.dataset.action;

        // UPVOTE

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

        // DOWNVOTE

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