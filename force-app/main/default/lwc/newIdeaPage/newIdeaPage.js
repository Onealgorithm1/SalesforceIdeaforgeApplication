import {
    LightningElement,
    track,
    wire,
    api
} from 'lwc';
import getLoggedInUserName
from '@salesforce/apex/UserController.getLoggedInUserName';

import saveIdea
from '@salesforce/apex/IdeaController.createIdea';

export default class NewIdeaPage extends LightningElement {

    @track title = '';

    @track description = '';

    @track category = '';

    @track ideaSpace = '';

    @track loggedInUser = '';

    @track titleError = '';

    @track descriptionError = '';

    @track categoryError = '';

    @track ideaSpaceError = '';
     
    @api
set titleFromIdeaForge(value){

    if(value){

        this.title = value;

    }

}

get titleFromIdeaForge(){

    return this.title;

}
/* USER */

    @wire(getLoggedInUserName)

    wiredUser({ data, error }){

        if(data){

            this.loggedInUser = data;

        }

    }

    /* TITLE */

    handleTitle(event){

        this.title = event.target.value;

        this.titleError = '';

    }

    /* DESCRIPTION */

    handleDescription(event){

        this.description = event.target.value;

        this.descriptionError = '';

    }

    /* CATEGORY */

    handleCategory(event){

        this.category = event.target.value;

        this.categoryError = '';

    }

    /* IDEA SPACE */

    handleIdeaSpace(event){

        this.ideaSpace = event.target.value;

        this.ideaSpaceError = '';

    }

    /* PUBLISH */

    publishIdea(){

        let isValid = true;

        this.titleError = '';

        this.descriptionError = '';

        this.categoryError = '';

        this.ideaSpaceError = '';

        if(!this.title){

            this.titleError = 'Title is required';

            isValid = false;

        }

        if(!this.description){

            this.descriptionError = 'Description is required';

            isValid = false;

        }

        if(!this.category){

            this.categoryError = 'Please select category';

            isValid = false;

        }

        if(!this.ideaSpace){

            this.ideaSpaceError = 'Please select idea space';

            isValid = false;

        }

        if(!isValid){

            return;

        }

        /* SAVE TO SALESFORCE */

        saveIdea({

            title:this.title,

            description:this.description,

            category:this.category,

            ideaSpace:this.ideaSpace

        })

        .then(() => {

            alert('Idea submitted successfully');

            location.reload();

        })

        .catch(error => {

    alert(JSON.stringify(error));

    console.log(error);

});
    }

}