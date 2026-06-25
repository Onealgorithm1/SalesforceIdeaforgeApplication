import { LightningElement, track, api } from 'lwc';
import getIdeasWithCounts from '@salesforce/apex/IdeaBoardController.getIdeasWithCounts';
import likeIdea from '@salesforce/apex/IdeaBoardController.likeIdea';
import unlikeIdea from '@salesforce/apex/IdeaBoardController.unlikeIdea';
import addComment from '@salesforce/apex/IdeaBoardController.addComment';
import getComments from '@salesforce/apex/IdeaBoardController.getComments';
import updateIdeaStatus from '@salesforce/apex/IdeaBoardController.updateIdeaStatus';

export default class Ideaboardall extends LightningElement {

    @api selectedCategory = 'All';

    @track ideation = [];
    @track development = [];
    @track production = [];

    ideationCount = 0;
    developmentCount = 0;
    productionCount = 0;

    showComment = false;
    currentId;
    commentText;

    selectedIdea = null;
    comments = [];
    isDetailView = false;

    draggedIdeaId;

    connectedCallback(){
        this.loadData();
    }

    renderedCallback(){
        this.loadData();
    }

    loadData(){
        getIdeasWithCounts({
            categoryName: this.selectedCategory
        })
        .then(data => {

            this.ideation = [];
            this.development = [];
            this.production = [];

            data.forEach(i => {

                if(i.Status__c === 'Ideation'){
                    this.ideation.push(i);
                }
                else if(i.Status__c === 'In Development'){
                    this.development.push(i);
                }
                else if(i.Status__c === 'In Production'){
                    this.production.push(i);
                }
            });

            this.ideationCount = this.ideation.length;
            this.developmentCount = this.development.length;
            this.productionCount = this.production.length;
        });
    }

    openDetail(event){
        const id = event.currentTarget.dataset.id;

        const allIdeas = [
            ...this.ideation,
            ...this.development,
            ...this.production
        ];

        this.selectedIdea =
            allIdeas.find(i => i.Id === id);

        this.currentId = id;
        this.isDetailView = true;

        this.loadComments();
    }

    loadComments(){
        getComments({
            ideaId: this.selectedIdea.Id
        })
        .then(res => {
            this.comments = res;
        });
    }

    goBack(){
        this.isDetailView = false;
    }

    handleLike(e){
        likeIdea({
            ideaId:e.target.dataset.id
        })
        .then(()=>{
            this.loadData();
        });
    }

    handleUnlike(e){
        unlikeIdea({
            ideaId:e.target.dataset.id
        })
        .then(()=>{
            this.loadData();
        });
    }

    openComment(e){
        this.currentId = e.target.dataset.id;
        this.showComment = true;
    }

    handleComment(e){
        this.commentText = e.target.value;
    }

    saveComment(){
        addComment({
            ideaId:this.currentId,
            txt:this.commentText
        })
        .then(()=>{
            this.showComment = false;

            this.loadData();

            if(this.isDetailView){
                this.loadComments();
            }
        });
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
        .then(()=>{
            this.loadData();
        });
    }
}