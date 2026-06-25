import { LightningElement } from 'lwc';

export default class TopHeader extends LightningElement {

    openNewIdea(){

        this.dispatchEvent(

            new CustomEvent('newidea')

        );

    }
handleNewEvent() {

    this.dispatchEvent(
        new CustomEvent('newevent')
    );

}
}