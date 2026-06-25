import { LightningElement, track } from 'lwc';

import createIdea from '@salesforce/apex/IdeaController.createIdea';

export default class NewIdeaModal extends LightningElement {

    @track title = '';

    @track description = '';

    @track category = '';

    @track recordId;
draftCreated = false;

    /* TITLE */

    handleTitle(event){

        this.title = event.target.value;

    }

    /* DESCRIPTION */

    handleDescription(event){

        this.description = event.target.value;

    }

    /* CATEGORY */

    handleCategory(event){

        this.category = event.target.value;

    }

    /* CATEGORY OPTIONS */

    get categoryOptions(){

        return [

            { label:'Bugs', value:'Bugs' },

            { label:'Product', value:'Product' },

            { label:'Salesforce', value:'Salesforce' },

            { label:'Sales/Opportunities', value:'Sales/Opportunities' },

            { label:'UI', value:'UI' },

            { label:'General', value:'General' }

        ];

    }
connectedCallback() {

    createIdea({
        title: 'Draft Idea',
        description: '',
        category: '',
        ideaSpace: ''
    })
    .then(result => {

        this.recordId = result;

        console.log('Record Id = ' + result);

    })
    .catch(error => {

        console.error(error);

    });

}
    /* CLOSE */

    closeModal(){

        this.dispatchEvent(

            new CustomEvent('close')

        );

    }

    /* SUBMIT */

    submitIdea(){

        createIdea({

            title:this.title,

            description:this.description,

            category:this.category

        })

        .then(() => {

            alert('Idea Submitted Successfully');

            this.closeModal();

        })

        .catch(error => {

            console.log(error);

        });

    }
   
}