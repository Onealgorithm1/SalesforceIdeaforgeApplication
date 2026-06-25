import { LightningElement, track } from 'lwc';

export default class SidebarNavigation extends LightningElement {
    @track showWorkspaceMenu = false;

    @track activeMenu = 'overview';

    /* MENU CLASSES */

    get overviewClass(){

        return this.activeMenu === 'overview'
            ? 'menu-item active'
            : 'menu-item';

    }

    get roadmapClass(){

        return this.activeMenu === 'roadmap'
            ? 'menu-item active'
            : 'menu-item';

    }

    get eventsClass(){

        return this.activeMenu === 'events'
            ? 'menu-item active'
            : 'menu-item';

    }

    get ideaForgeClass(){

        return this.activeMenu === 'ideaForge'
            ? 'menu-item active'
            : 'menu-item';

    }

    get oneAlgoClass(){

        return this.activeMenu === 'oneAlgo'
            ? 'menu-item active'
            : 'menu-item';

    }

    get allCategoriesClass(){

        return this.activeMenu === 'allCategories'
            ? 'menu-item active'
            : 'menu-item';

    }

    get bugsClass(){

        return this.activeMenu === 'bugs'
            ? 'menu-item active'
            : 'menu-item';

    }

    get productClass(){

        return this.activeMenu === 'product'
            ? 'menu-item active'
            : 'menu-item';

    }

    get salesClass(){

        return this.activeMenu === 'sales'
            ? 'menu-item active'
            : 'menu-item';

    }

    get salesforceClass(){

        return this.activeMenu === 'salesforce'
            ? 'menu-item active'
            : 'menu-item';

    }

    get uiClass(){

        return this.activeMenu === 'ui'
            ? 'menu-item active'
            : 'menu-item';

    }
      get martechClass(){

        return this.activeMenu === 'MarTech'
            ? 'menu-item active'
            : 'menu-item';

    }
      get aimarketingagent(){

        return this.activeMenu === 'AI Marketing Agent'
            ? 'menu-item active'
            : 'menu-item';

    }

    /* OVERVIEW */

    openOverview(){

        this.activeMenu = 'overview';

        this.dispatchEvent(

            new CustomEvent('navigate',{

                detail:'overview'

            })

        );

    }

    /* ROADMAP */

    openRoadmap(){

        this.activeMenu = 'roadmap';

        this.dispatchEvent(

            new CustomEvent('navigate',{

                detail:'roadmap'

            })

        );

    }

    /* EVENTS */

    openEvents(){

        this.activeMenu = 'events';

        this.dispatchEvent(

            new CustomEvent('navigate',{

                detail:'events'

            })

        );

    }

    /* IDEA FORGE */

    openIdeaForge(){

        this.activeMenu = 'ideaForge';

        this.dispatchEvent(

            new CustomEvent('navigate',{

                detail:'ideaForge'

            })

        );

    }

    /* ONE ALGORITHM */

    openOneAlgo() {

    this.activeMenu = 'oneAlgo';

    this.dispatchEvent(
        new CustomEvent('navigate', {
            detail: 'oneAlgo'
        })
    );
}

    /* ALL CATEGORIES */

   openAllCategories(){

    this.activeMenu = 'allCategories';

}
    /* BUGS */

    openBugs(){

        this.activeMenu = 'bugs';

        this.dispatchEvent(

            new CustomEvent('navigate',{

                detail:'bugs'

            })

        );

    }

    /* PRODUCT */

    openProduct(){

        this.activeMenu = 'product';

        this.dispatchEvent(

            new CustomEvent('navigate',{

                detail:'product'

            })

        );

    }

    /* SALES */

    openSales(){

    this.activeMenu = 'sales';

    this.dispatchEvent(

        new CustomEvent('navigate',{

            detail:'sales'

        })

    );

}

    /* SALESFORCE */

    openSalesforce(){

        this.activeMenu = 'salesforce';

        this.dispatchEvent(

            new CustomEvent('navigate',{

                detail:'salesforce'

            })

        );

    }

    /* UI */

    openUI(){

        this.activeMenu = 'ui';

        this.dispatchEvent(

            new CustomEvent('navigate',{

                detail:'ui'

            })

        );

    }
     /* MarTech */

    openMarTech(){

        this.activeMenu = 'MarTech';

        this.dispatchEvent(

            new CustomEvent('navigate',{

                detail:'MarTech'

            })

        );

    }
     /* AI Marketing Agent */

    openAIMarketingAgent(){

        this.activeMenu = 'AI Marketing Agent';

        this.dispatchEvent(

            new CustomEvent('navigate',{

                detail:'AI Marketing Agent'

            })

        );

    }

    /*ORG NAVIGATION DEFAULD AND CREATE WORKSPACE */
    toggleWorkspaceMenu() {
    this.showWorkspaceMenu = !this.showWorkspaceMenu;
    }
    goToDefaultOrg() {

    this.showWorkspaceMenu = false;

    this.dispatchEvent(
        new CustomEvent('navigate', {
            detail: 'defaultOrg'
        })
    );
    }
    goToCreateWorkspace() {

    this.showWorkspaceMenu = false;

    this.dispatchEvent(
        new CustomEvent('navigate', {
            detail: 'createWorkspace'
        })
    );
    }

}