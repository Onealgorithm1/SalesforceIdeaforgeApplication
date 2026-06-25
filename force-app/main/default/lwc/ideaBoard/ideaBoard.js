import { LightningElement, wire } from 'lwc';
import getIdeas from '@salesforce/apex/IdeaController.getIdeas';

export default class IdeaBoard extends LightningElement {

    ideas;

    @wire(getIdeas)
    wired({data,error}){
        if(data){
            this.ideas = data;
        } else if(error){
            console.error(error);
        }
    }
}