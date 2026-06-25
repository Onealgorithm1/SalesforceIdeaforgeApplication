import { LightningElement,wire,track } from 'lwc';
import getEvents
from '@salesforce/apex/EventController.getEvents';
export default class EventsPage extends LightningElement {
     @track events=[];

    @wire(getEvents)
    wiredEvents({data,error}){

        if(data){

            this.events=data;

        }
    }

    openModal(){

        this.dispatchEvent(
            new CustomEvent('newevent')
        );

    }

    openEvent(event){

        const id =
        event.currentTarget.dataset.id;

        window.location.href =
        '/lightning/n/Event_Detail?recordId=' + id;

    }

}