import { LightningElement, track } from 'lwc';

export default class CategorySidebar extends LightningElement {

    @track selectedCategory = 'All';

    selectCategory(event){
        this.selectedCategory =
            event.currentTarget.dataset.name;
    }

    showAll(){
        this.selectedCategory = 'All';
    }
}