import { LightningElement, track } from 'lwc';
import createEvent from '@salesforce/apex/EventController.createEvent';

export default class NewEventPage extends LightningElement {

    @track imagePreview;
    @track showSuccess = false;

    title = '';
    description = '';
    eventType = 'Poll';
    location = '';
    eventDateTime = '';
    coverImageUrl = '';

    handleTitle(event) {

        this.title = event.target.value;

    }

    handleDescription(event) {

        this.description = event.target.value;

    }

    handleLocation(event) {

        this.location = event.target.value;

    }

    handleDate(event) {

        this.eventDateTime = event.target.value;

    }

    handleFileUpload(event) {

        const file = event.target.files[0];

        if (file) {

            const reader = new FileReader();

            reader.onload = () => {

                this.imagePreview = reader.result;
                this.coverImageUrl = reader.result;

            };

            reader.readAsDataURL(file);

        }

    }

    selectType(event) {

        this.eventType =
            event.currentTarget.dataset.type;

    }

    get showPollOptions() {

        return this.eventType === 'Poll';

    }

    get pollClass() {

        return this.eventType === 'Poll'
            ? 'type-btn active'
            : 'type-btn';

    }

    get challengeClass() {

        return this.eventType === 'Challenge'
            ? 'type-btn active'
            : 'type-btn';

    }

    get hackathonClass() {

        return this.eventType === 'Hackathon'
            ? 'type-btn active'
            : 'type-btn';

    }

    get announcementClass() {

        return this.eventType === 'Announcement'
            ? 'type-btn active'
            : 'type-btn';

    }

    createEvent() {

        if (!this.title) {

            alert('Please enter Event Title');
            return;

        }

        if (!this.eventDateTime) {

            alert('Please select Event Date & Time');
            return;

        }

        createEvent({

            title: this.title,
            description: this.description,
            eventType: this.eventType,
            location: this.location,
            eventDateTime: this.eventDateTime,

            // MUST MATCH APEX PARAMETER NAME
            imageUrl: this.coverImageUrl

        })

        .then(result => {

            console.log(
                'Event Created Successfully: ',
                result
            );

            this.showSuccess = true;

        })

        .catch(error => {

            console.error(
                JSON.stringify(error)
            );

            let message = 'Error Creating Event';

            if (
                error &&
                error.body &&
                error.body.message
            ) {

                message =
                    error.body.message;

            }

            alert(message);

        });

    }

    closeSuccess() {

        this.showSuccess = false;

        this.title = '';
        this.description = '';
        this.location = '';
        this.eventDateTime = '';
        this.coverImageUrl = '';
        this.imagePreview = null;

        window.location.reload();

    }

    closeModal() {

        window.history.back();

    }

}