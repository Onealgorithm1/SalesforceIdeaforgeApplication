import { LightningElement, track } from 'lwc';
import saveIdea from '@salesforce/apex/IdeaController.saveIdea';

export default class CreateIdea extends LightningElement {

    @track title = '';
    @track tags = '';
    @track category = '';
    @track ideaSpace = '';
    @track description = '';

    // 🔥 TOAST
    @track showToast = false;
    @track toastMessage = '';

    categoryOptions = [
        { label: 'Bugs', value: 'Bugs' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Product', value: 'Product' },
        { label: 'R&D', value: 'R&D' },
        { label: 'Sales', value: 'Sales' },
        { label: 'UI', value: 'UI' }
    ];

    ideaSpaceOptions = [
        { label: 'Ideaforge', value: 'Ideaforge' },
        { label: 'OneAlgorithm', value: 'OneAlgorithm' }
    ];

    handleTitle(e){ this.title = e.target.value; }
    handleTags(e){ this.tags = e.target.value; }
    handleCategory(e){ this.category = e.detail.value; }
    handleIdeaSpace(e){ this.ideaSpace = e.detail.value; }
    handleDesc(e){ this.description = e.target.value; }

    save(){

        if(!this.title || !this.category || !this.ideaSpace || !this.description){
            this.showCustomToast('Please fill all required fields');
            return;
        }

        saveIdea({
            title: this.title,
            description: this.description,
            category: this.category,
            tags: this.tags,
            ideaSpace: this.ideaSpace
        })
        .then(() => {

            // ✅ SHOW TOAST
            this.showCustomToast('🎉 Idea submitted successfully!');

            // ✅ RESET FORM
            this.resetForm();

        })
        .catch(error=>{
            this.showCustomToast('Error: ' + (error.body?.message || error.message));
        });
    }

    // 🔥 RESET FORM (IMPORTANT FIX)
    resetForm(){
        this.title = '';
        this.tags = '';
        this.category = '';
        this.ideaSpace = '';
        this.description = '';
    }

    // 🔥 CUSTOM TOAST (WORKS IN LWR)
    showCustomToast(msg){
        this.toastMessage = msg;
        this.showToast = true;

        setTimeout(() => {
            this.showToast = false;
        }, 3000);
    }
}