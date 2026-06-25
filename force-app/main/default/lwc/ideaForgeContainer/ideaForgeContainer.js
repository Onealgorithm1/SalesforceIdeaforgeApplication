import { LightningElement, track } from 'lwc';
    export default class IdeaForgeContainer extends LightningElement {

        @track currentPage = 'overview';
        @track newIdeaTitle = '';
        @track newEventTitle = '';
        @track selectedIdeaId;

        /* OVERVIEW */

        get isOverview(){

            return this.currentPage === 'overview';

        }

        /* ROADMAP */

        get isRoadmap(){

            return this.currentPage === 'roadmap';

        }

        /* EVENTS */

        get isEvents(){

            return this.currentPage === 'events';

        }

        /* IDEA FORGE */

        get isIdeaForge(){

            return this.currentPage === 'ideaForge';

        }

        /* ONE ALGORITHM */

        get isOneAlgorithm(){

            return this.currentPage === 'oneAlgorithm';

        }
        openIdeaDetail(event) {

    console.log('CONTAINER RECEIVED');

    this.selectedIdeaId =
        event.detail.ideaId;

    this.currentPage =
        'ideaDetail';
}
    get isIdeaDetail() {

        return this.currentPage === 'ideaDetail';

    }

        /* BUGS */

        get isBugs(){

            return this.currentPage === 'bugs';

        }

        /* PRODUCT */

        get isProduct(){

            return this.currentPage === 'product';

        }

        /* SALES */

        get isSales(){

            return this.currentPage === 'sales';

        }

        /* SALESFORCE */

        get isSalesforce(){

            return this.currentPage === 'salesforce';

        }

        /* UI */

        get isUI(){

            return this.currentPage === 'ui';

        }
        get ismarTech(){

            return this.currentPage === 'MarTech';

        }
        get isaimarketingagent(){

            return this.currentPage === 'AI Marketing Agent';

        }

        /* NEW IDEA */

        get isNewIdea(){

            return this.currentPage === 'newIdea';

        }

            /* NEW Event */

        get isEventpage(){

            return this.currentPage === 'newevent';

        }

        /* NAVIGATION */

        handleNavigation(event){

            this.currentPage = event.detail;

        }

        /* OPEN NEW IDEA PAGE */

        openNewIdeaModal(event){

        this.newIdeaTitle =
            event?.detail?.title || '';

        this.currentPage = 'newIdea';

    }

    /* OPEN NEW EVENT PAGE */

        openNewEventModal(event){

        this.newEventTitle =
            event?.detail?.title || '';

        this.currentPage = 'newevent';

    }
    handleBack() {

    this.currentPage = 'ideaForge';

}

    }